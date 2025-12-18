
import { NextResponse } from "next/server";
import { z } from "zod";
import * as etherscan from "@/lib/etherscan";
import { generateWalletPersonality } from "@/ai/flows/generate-wallet-personality";
import { generateTimelineEvents } from "@/ai/flows/generate-timeline-events";
import { WalletStats, EtherscanTx, EtherscanTokenTx, EtherscanNftTx } from "@/lib/types";

const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const ENS_REGEX = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const RequestBodySchema = z.object({
  address: z.string().refine(
    (val) => WALLET_ADDRESS_REGEX.test(val) || ENS_REGEX.test(val),
    "Invalid Ethereum address or ENS name"
  ),
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

function createRecentActivitySummary(transactions: any[], daysSinceLastTx: number): string {
    if (daysSinceLastTx > 90) {
        return "Wallet has been inactive for a while.";
    }
    const recentTx = transactions.slice(-10);
    return `Last ${recentTx.length} transactions happened in the last ${daysSinceLastTx} days.`;
}

function summarizeTransactionsForAI(transactions: EtherscanTx[], tokens: EtherscanTokenTx[], nfts: EtherscanNftTx[]): string {
    let summary = '';
    const txCount = transactions.length;

    if (txCount > 0) {
        const firstTxDate = new Date(parseInt(transactions[0].timeStamp) * 1000).toLocaleDateString();
        const lastTxDate = new Date(parseInt(transactions[txCount-1].timeStamp) * 1000).toLocaleDateString();
        summary += `Total Transactions: ${txCount} (from ${firstTxDate} to ${lastTxDate})\n`;

        const sortedByValue = [...transactions].sort((a,b) => parseFloat(b.value) - parseFloat(a.value));
        const largestTx = sortedByValue[0];
        if (largestTx) {
            summary += `Largest transaction: a transfer of ${(parseInt(largestTx.value) / 1e18).toFixed(4)} ETH on ${new Date(parseInt(largestTx.timeStamp) * 1000).toLocaleDateString()}.\n`
        }

        const sampleTxs = transactions.slice(0, 5); // get first 5
        summary += 'Sample Transactions (first 5):\n';
        sampleTxs.forEach(tx => {
            const date = new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString();
            const value = (parseInt(tx.value) / 1e18).toFixed(4);
            summary += `- Date: ${date}, To: ${tx.to.slice(0,10)}..., Value: ${value} ETH\n`;
        });
    }

    if (tokens.length > 0) {
        summary += `\nFound ${tokens.length} token transfers. First token transfer on ${new Date(parseInt(tokens[0].timeStamp) * 1000).toLocaleDateString()}.\n`;
        const uniqueTokens = new Set(tokens.map(t => t.tokenSymbol));
        summary += `Unique tokens: ${Array.from(uniqueTokens).slice(0,5).join(', ')}\n`

        tokens.slice(0, 3).forEach(tx => {
            summary += `- Token: ${tx.tokenSymbol}, To: ${tx.to.slice(0,10)}...\n`;
        });
    }

    if (nfts.length > 0) {
        summary += `\nFound ${nfts.length} NFT transfers. First NFT transfer on ${new Date(parseInt(nfts[0].timeStamp) * 1000).toLocaleDateString()}.\n`;
        const uniqueCollections = new Set(nfts.map(t => t.tokenName));
        summary += `Unique collections: ${Array.from(uniqueCollections).slice(0,3).join(', ')}\n`

        nfts.slice(0, 3).forEach(tx => {
            summary += `- NFT: ${tx.tokenName} #${tx.tokenID.slice(0,5)}..., To: ${tx.to.slice(0,10)}...\n`;
        });
    }

    return summary;
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = RequestBodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid address format. Please provide a valid Ethereum address or ENS name." },
        { status: 400 }
      );
    }
    const { address } = validation.data;

    // Fetch required data in parallel
    const [balanceWei, transactions] = await Promise.all([
        etherscan.getAccountBalance(address),
        etherscan.getTransactions(address),
    ]);

    if (!transactions || transactions.length === 0) {
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
      walletAgeInDays: walletAgeInDays,
      recentActivitySummary: createRecentActivitySummary(transactions, daysSinceLastTx),
    };

    const transactionSummaryForAI = summarizeTransactionsForAI(transactions, tokenTransfers, nftTransfers);
    
    // Generate story and timeline with AI in parallel
    const [personalityResult, timelineEvents] = await Promise.all([
      generateWalletPersonality(aiInput),
      generateTimelineEvents({ transactionSummary: transactionSummaryForAI }),
    ]);

    const stats: WalletStats = {
      walletAge: walletAgeInDays,
      txCount: transactions.length,
      balance: balanceEth.toFixed(4),
      activityStatus: activityStatus,
    };
    
    const analysisResult = {
        personality: `${personalityResult.personalityTitle}`, // Using title as the main personality
        story: `${personalityResult.oneLineSummary}\n\n${personalityResult.personalityStory}`,
        highlights: personalityResult.traits,
        stats: stats,
        limitedData: limitedData,
        personalityData: personalityResult,
        timelineEvents: timelineEvents
    }


    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error("Analysis API Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected server error occurred.";
    let status = 500;
    if (message.includes("rate limit")) status = 429;
    
    return NextResponse.json({ error: message }, { status });
  }
}
