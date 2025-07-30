'use server';
/**
 * @fileOverview Generates a helpful suggestion for improving a resume.
 *
 * - generateSuggestion - A function that generates a suggestion based on missing skills.
 * - GenerateSuggestionInput - The input type for the generateSuggestion function.
 * - GenerateSuggestionOutput - The return type for the generateSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSuggestionInputSchema = z.object({
  missingSkills: z.array(z.string()).describe('A list of skills from the job description that are missing from the resume.'),
});
export type GenerateSuggestionInput = z.infer<typeof GenerateSuggestionInputSchema>;

const GenerateSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('A paragraph of advice on how to improve the resume.'),
});
export type GenerateSuggestionOutput = z.infer<typeof GenerateSuggestionOutputSchema>;

export async function generateSuggestion(input: GenerateSuggestionInput): Promise<GenerateSuggestionOutput> {
  return generateSuggestionFlow(input);
}

const suggestionPrompt = ai.definePrompt({
  name: 'generateSuggestionPrompt',
  input: {schema: GenerateSuggestionInputSchema},
  output: {schema: GenerateSuggestionOutputSchema},
  prompt: `You are a helpful career coach. Your task is to provide a concise, one-paragraph piece of advice to a user on how to improve their resume based on a list of missing skills.

  Missing Skills:
  {{#each missingSkills}}
  - {{this}}
  {{/each}}

  {{#if missingSkills.length}}
  Based on the missing skills, generate a friendly and encouraging paragraph of advice. For example: "To better align your resume with this job, consider highlighting projects or experiences where you've used skills like {{#each missingSkills}}{{#if @index}}, {{/if}}{{this}}{{/each}}. Even adding these keywords can make a big difference!"
  {{else}}
  Your resume looks like a great fit! There are no major skills missing. As a general tip, you could tailor the project descriptions to better match the company's values.
  {{/if}}
  `,
});


const generateSuggestionFlow = ai.defineFlow(
  {
    name: 'generateSuggestionFlow',
    inputSchema: GenerateSuggestionInputSchema,
    outputSchema: GenerateSuggestionOutputSchema,
  },
  async input => {
    const {output} = await suggestionPrompt(input);
    if (!output) {
      return { suggestion: "We couldn't generate a suggestion at this time." };
    }
    return output;
  }
);
