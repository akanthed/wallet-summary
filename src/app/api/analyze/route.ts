import { NextResponse } from "next/server";
import { z } from "zod";
import * as etherscan from "@/lib/etherscan";
import { generateWalletStory } from "@/ai/flows/generate-wallet-story";
import { WalletStats } from "@/lib/types";

const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

const RequestBodySchema = z.object({
  address: z.string().regex(WALLET_ADDRESS_REGEX, "Invalid Ethereum address"),
});

function createSummary(items: any[], type: 'token' | 'nft'): string {
    if (!items || items.length === 0) return "No activity detected";
  
    if (type === 'token') {
      const uniqueTokens = new Set(items.map(item => item.tokenSymbol));
      return `Transferred ${uniqueTokens.size} different token(s) across ${items.length} transactions.`;
    }
  
    if (type === 'nft') {
      const uniqueCollections = new Set(items.map(item => item.tokenName));
      return `Transferred ${items.length} NFT(s) from ${uniqueCollections.size} different collection(s).`;
    }
    return "No activity detected";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = RequestBodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid address format. Please provide a valid Ethereum address." },
        { status: 400 }
      );
    }
    const { address } = validation.data;

    // Fetch required data in parallel
    const [balanceWei, transactions] = await Promise.all([
        etherscan.getAccountBalance(address),
        etherscan.getTransactions(address),
    ]);

    if (transactions.length === 0) {
        return NextResponse.json(
            { error: "This wallet has no transaction history." },
            { status: 404 }
        );
    }

    // Fetch optional data
    const [tokenTransfers, nftTransfers] = await Promise.all([
        etherscan.getTokenTransfers(address),
        etherscan.getNftTransfers(address),
    ]);
    const limitedData = tokenTransfers.length === 0 && nftTransfers.length === 0;

    const firstTx = transactions[0];
    const lastTx = transactions[transactions.length - 1];

    const walletAgeInDays = Math.floor(
        (Date.now() - parseInt(firstTx.timeStamp) * 1000) / (1000 * 60 * 60 * 24)
    );

    const daysSinceLastTx = Math.floor(
        (Date.now() - parseInt(lastTx.timeStamp) * 1000) / (1000 * 60 * 60 * 24)
    );

    let activityStatus: WalletStats['activityStatus'] = 'Dormant';
    if (daysSinceLastTx <= 30) activityStatus = 'Active';
    else if (daysSinceLastTx <= 180) activityStatus = 'Moderate';

    const balanceEth = parseFloat(balanceWei) / 1e18;

    const aiInput = {
      address,
      firstTxDate: new Date(parseInt(firstTx.timeStamp) * 1000).toLocaleDateString(),
      lastTxDate: new Date(parseInt(lastTx.timeStamp) * 1000).toLocaleDateString(),
      txCount: transactions.length,
      balance: parseFloat(balanceEth.toFixed(4)),
      tokenSummary: createSummary(tokenTransfers, 'token'),
      nftSummary: createSummary(nftTransfers, 'nft'),
      walletAge: walletAgeInDays,
    };
    
    // Generate story with AI
    const storyResult = await generateWalletStory(aiInput);

    const stats: WalletStats = {
      walletAge: walletAgeInDays,
      txCount: transactions.length,
      balance: balanceEth.toFixed(4),
      activityStatus: activityStatus,
    };

    return NextResponse.json({
      personality: storyResult.personality,
      story: storyResult.story,
      stats: stats,
      limitedData: limitedData
    });

  } catch (error) {
    console.error("Analysis API Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected server error occurred.";
    let status = 500;
    if (message.includes("rate limit")) status = 429;
    
    return NextResponse.json({ error: message }, { status });
  }
}
