'use server';

/**
 * @fileOverview Extracts the job title from a job description.
 *
 * - extractJobTitle - A function that handles the job title extraction.
 * - ExtractJobTitleInput - The input type for the extractJobTitle function.
 * - ExtractJobTitleOutput - The return type for the extractJobTitle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractJobTitleInputSchema = z.object({
  jobDescription: z.string().describe('The job description to analyze.'),
});
export type ExtractJobTitleInput = z.infer<typeof ExtractJobTitleInputSchema>;

const ExtractJobTitleOutputSchema = z.object({
  jobTitle: z
    .string()
    .describe('The extracted job title from the job description.'),
});
export type ExtractJobTitleOutput = z.infer<
  typeof ExtractJobTitleOutputSchema
>;

export async function extractJobTitle(
  input: ExtractJobTitleInput
): Promise<ExtractJobTitleOutput> {
  return extractJobTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractJobTitlePrompt',
  input: { schema: ExtractJobTitleInputSchema },
  output: { schema: ExtractJobTitleOutputSchema },
  prompt: `You are an expert at extracting the job title from a job description. Please extract just the job title from the following text.

Job Description: {{{jobDescription}}}

Return just the job title. If you cannot determine a job title, return "Unknown".`,
});

const extractJobTitleFlow = ai.defineFlow(
  {
    name: 'extractJobTitleFlow',
    inputSchema: ExtractJobTitleInputSchema,
    outputSchema: ExtractJobTitleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
