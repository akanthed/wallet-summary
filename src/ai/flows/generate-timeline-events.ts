'use server';

/**
 * @fileOverview Analyzes transaction history to generate key timeline events.
 *
 * - generateTimelineEvents - A function that creates a timeline from transaction data.
 * - GenerateTimelineEventsInput - The input type for the function.
 * - GenerateTimelineEventsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { TimelineEvent } from '@/lib/types';


const GenerateTimelineEventsInputSchema = z.object({
  transactionSummary: z.string().describe('A summary of transaction, token, and NFT history.'),
});
export type GenerateTimelineEventsInput = z.infer<typeof GenerateTimelineEventsInputSchema>;


// The output is an array of TimelineEvent objects
const GenerateTimelineEventsOutputSchema = z.array(z.object({
    date: z.string().describe("The date of the event (e.g., 'YYYY-MM-DD')."),
    type: z.enum(['Creation', 'Transaction', 'NFT', 'Token', 'Activity', 'Milestone']).describe("The type of event."),
    title: z.string().describe("A short, catchy title for the event."),
    description: z.string().describe("A one-sentence description of the event."),
    value: z.string().optional().describe("A value associated with the event, like an amount or token name."),
}));

export type GenerateTimelineEventsOutput = z.infer<typeof GenerateTimelineEventsOutputSchema>;

export async function generateTimelineEvents(input: GenerateTimelineEventsInput): Promise<GenerateTimelineEventsOutput> {
  return generateTimelineEventsFlow(input);
}


const timelinePrompt = ai.definePrompt({
  name: 'generateTimelineEventsPrompt',
  input: {schema: GenerateTimelineEventsInputSchema},
  output: {schema: GenerateTimelineEventsOutputSchema},
  system: `You are a blockchain historian. Your task is to identify 5-7 key milestone events from a wallet's transaction history and present them as a timeline.

RULES:
- Identify the most significant events. Don't just list transactions.
- Focus on "firsts," "biggests," "most active periods," and "long pauses."
- The event date must be the date of the transaction that triggered it.
- Titles should be short and descriptive (e.g., "The Beginning," "First NFT," "Shopping Spree").
- Descriptions should be one concise sentence.
- Always include the wallet's creation as the first event.
- Infer milestones like "100th Transaction" or "1 Year Anniversary".
- If there are long gaps, create an "Activity" event like "Hibernation" or "Quiet Period".
- If there's a burst of activity, create an event like "Peak Activity".

Event Types:
- Creation: The very first transaction.
- Transaction: A significant ETH transfer.
- NFT: First NFT purchase or a notable NFT event.
- Token: First ERC20 token interaction.
- Activity: Periods of high or low activity.
- Milestone: Anniversaries, transaction count milestones, etc.
`,
  prompt: `Analyze the following transaction summary and generate a timeline of 5-7 key events.

Transaction Summary:
{{{transactionSummary}}}

Generate a JSON array of timeline events based on this data.
`,
});

const generateTimelineEventsFlow = ai.defineFlow(
  {
    name: 'generateTimelineEventsFlow',
    inputSchema: GenerateTimelineEventsInputSchema,
    outputSchema: GenerateTimelineEventsOutputSchema,
  },
  async (input) => {
    const {output} = await timelinePrompt(input);
    
    // Sort events by date just in case the AI doesn't
    return output!.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
);
