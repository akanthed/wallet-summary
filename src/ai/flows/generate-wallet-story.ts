'use server';

/**
 * @fileOverview Generates a story about an Ethereum wallet based on its transaction history and other data.
 *
 * - generateWalletStory - A function that generates the wallet story.
 * - GenerateWalletStoryInput - The input type for the generateWalletStory function.
 * - GenerateWalletStoryOutput - The return type for the generateWalletStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWalletStoryInputSchema = z.object({
  address: z.string().describe('The Ethereum wallet address.'),
  firstTxDate: z.string().describe('The date of the first transaction.'),
  lastTxDate: z.string().describe('The date of the last transaction.'),
  txCount: z.number().describe('The total number of transactions.'),
  balance: z.number().describe('The current ETH balance.'),
  tokenSummary: z.string().optional().describe('A summary of token activity.'),
  nftSummary: z.string().optional().describe('A summary of NFT activity.'),
  walletAge: z.number().describe('The age of the wallet in days.'),
});
export type GenerateWalletStoryInput = z.infer<typeof GenerateWalletStoryInputSchema>;

const GenerateWalletStoryOutputSchema = z.object({
  personality: z.string().describe('The personality of the wallet (emoji + label).'),
  story: z.string().describe('The AI-generated story about the wallet, formatted into 2-3 paragraphs separated by newline characters (\\n).'),
  highlights: z.array(z.string()).describe('A list of 3-5 interesting bullet points about the wallet\'s activity.'),
});
export type GenerateWalletStoryOutput = z.infer<typeof GenerateWalletStoryOutputSchema>;

export async function generateWalletStory(input: GenerateWalletStoryInput): Promise<GenerateWalletStoryOutput> {
  return generateWalletStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWalletStoryPrompt',
  input: {schema: GenerateWalletStoryInputSchema},
  output: {schema: GenerateWalletStoryOutputSchema},
  prompt: `Analyze this Ethereum wallet and create an engaging summary:

WALLET DATA:
- Address: {{address}}
- First transaction: {{firstTxDate}} ({{walletAge}} days ago)
- Last transaction: {{lastTxDate}}
- Total transactions: {{txCount}}
- Current ETH balance: {{balance}} ETH
- Token activity: {{#if tokenSummary}}{{tokenSummary}}{{else}}No token transfers detected{{/if}}
- NFT activity: {{#if nftSummary}}{{nftSummary}}{{else}}No NFT activity detected{{/if}}

TASK:
1.  **Personality:** Choose ONE personality that best fits this wallet from: Whale, Diamond Hands, NFT Collector, Active Trader, Newbie Explorer, Dormant Wallet, DeFi Farmer.
2.  **Narrative:** Write a 2-paragraph story explaining:
    *   When and how this wallet started.
    *   What patterns or behavior define this wallet's journey.
    *   Its current status and activity level.
3.  **Highlights:** Create a list of 3-5 short, interesting bullet points about the wallet. Examples: "First dabbled in NFTs during the 2021 bull run" or "Seems to favor DeFi protocols like Uniswap".

TONE: Friendly, curious, storytelling (not financial advice).
FORMAT: Return JSON. The 'story' field must contain 2 paragraphs separated by a newline (\\n). The 'highlights' field must be an array of strings.
{
  "personality": "emoji label",
  "story": "Paragraph 1...\\nParagraph 2...",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
}`,
});

const generateWalletStoryFlow = ai.defineFlow(
  {
    name: 'generateWalletStoryFlow',
    inputSchema: GenerateWalletStoryInputSchema,
    outputSchema: GenerateWalletStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
