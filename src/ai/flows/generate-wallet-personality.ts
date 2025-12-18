'use server';

/**
 * @fileOverview Generates a personality profile for an Ethereum wallet.
 *
 * - generateWalletPersonality - A function that generates the wallet personality.
 * - GenerateWalletPersonalityInput - The input type for the function.
 * - GenerateWalletPersonalityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWalletPersonalityInputSchema = z.object({
  address: z.string().describe('The Ethereum wallet address.'),
  walletAgeInDays: z.number().describe('The age of the wallet in days.'),
  firstTxDate: z.string().describe('The date of the first transaction.'),
  lastTxDate: z.string().describe('The date of the last transaction.'),
  txCount: z.number().describe('The total number of transactions.'),
  balance: z.number().describe('The current ETH balance.'),
  tokenSummary: z.string().optional().describe('A summary of token activity.'),
  nftSummary: z.string().optional().describe('A summary of NFT activity.'),
  recentActivitySummary: z.string().optional().describe('A summary of recent activity.'),
});
export type GenerateWalletPersonalityInput = z.infer<typeof GenerateWalletPersonalityInputSchema>;

const GenerateWalletPersonalityOutputSchema = z.object({
    personalityTitle: z.string().describe("The wallet's personality type (e.g., 'The Quiet Strategist')."),
    oneLineSummary: z.string().describe("A one-line summary of the wallet's behavior."),
    traits: z.array(z.string()).length(3).describe("A list of exactly 3 personality traits."),
    personalityStory: z.string().describe("A short paragraph (4-5 lines max) explaining the wallet's behavior."),
});
export type GenerateWalletPersonalityOutput = z.infer<typeof GenerateWalletPersonalityOutputSchema>;


export async function generateWalletPersonality(input: GenerateWalletPersonalityInput): Promise<GenerateWalletPersonalityOutput> {
  return generateWalletPersonalityFlow(input);
}

const personalityPrompt = ai.definePrompt({
  name: 'generateWalletPersonalityPrompt',
  input: {schema: GenerateWalletPersonalityInputSchema},
  output: {schema: GenerateWalletPersonalityOutputSchema},
  system: `You are an AI storyteller and behavioral analyst for blockchain wallets.

Your job is to analyze Ethereum wallet activity and describe it as if it were a human personality.
You must:
- Avoid financial advice
- Avoid price predictions
- Avoid judgmental language
- Be engaging, friendly, and easy to understand
- Focus on behavior patterns, not profit or loss
- Write for curious, non-technical users

Output must be:
- Creative but grounded in the data provided
- Short, readable, and shareable
- Confident in tone, not speculative

Never mention that this is AI-generated.
Never mention regulations or compliance.
`,
  prompt: `Analyze the following Ethereum wallet data and describe it as a person.

Wallet Data:
- Wallet age (days): {{walletAgeInDays}}
- First transaction date: {{firstTxDate}}
- Last transaction date: {{lastTxDate}}
- Total transactions: {{txCount}}
- ETH balance: {{balance}}
- Recent activity summary: {{#if recentActivitySummary}}{{recentActivitySummary}}{{else}}No recent activity detected.{{/if}}
- Token activity summary: {{#if tokenSummary}}{{tokenSummary}}{{else}}No token transfers detected.{{/if}}
- NFT activity summary: {{#if nftSummary}}{{nftSummary}}{{else}}No NFT activity detected.{{/if}}

TASK:
1. Describe who this wallet would be IF IT WERE A PERSON.
2. Give them:
   - A personality type (1 short title)
   - 3 personality traits
   - A short lifestyle description
3. Write 1 short paragraph (4-5 lines max) explaining their behavior.

STYLE RULES:
- Use metaphors and analogies
- Casual, human tone
- Curious and fun, not technical
- Do NOT mention numbers directly unless needed
- Do NOT mention “wallet”, “address”, or “blockchain” in the final output

If the wallet activity aligns with major crypto periods (NFT boom, bear market, post-merge), subtly reference it as life phases.

OUTPUT FORMAT (STRICT):
Return a JSON object matching the output schema.
`,
});

const generateWalletPersonalityFlow = ai.defineFlow(
  {
    name: 'generateWalletPersonalityFlow',
    inputSchema: GenerateWalletPersonalityInputSchema,
    outputSchema: GenerateWalletPersonalityOutputSchema,
  },
  async input => {
    const {output} = await personalityPrompt(input);
    return output!;
  }
);
