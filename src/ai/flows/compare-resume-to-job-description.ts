'use server';

/**
 * This file defines a Genkit flow to compare a resume with a job description.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CompareResumeToJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description.'),
  resume: z.string().describe('The resume.'),
});

export type CompareResumeToJobDescriptionInput = z.infer<typeof CompareResumeToJobDescriptionInputSchema>;

const CompareResumeToJobDescriptionOutputSchema = z.object({
  jobTitle: z.string().describe('The job title extracted from the job description.'),
  similarityScore: z.number().describe('Similarity score between 0 and 100.'),
  matchedSkills: z.array(z.string()).describe('Skills from the JD found in the resume.'),
  missingSkills: z.array(z.string()).describe('Skills in JD not found in resume.'),
  suggestion: z.string().describe('Advice for improving the resume.'),
});

export type CompareResumeToJobDescriptionOutput = z.infer<typeof CompareResumeToJobDescriptionOutputSchema>;

const comparisonAndSuggestionPrompt = ai.definePrompt({
  name: 'comparisonAndSuggestionPrompt',
  input: { schema: CompareResumeToJobDescriptionInputSchema },
  output: { schema: CompareResumeToJobDescriptionOutputSchema },
  prompt: `You are an expert HR analyst. Your task is to analyze the provided job description and resume, then return a detailed analysis in JSON format.

Steps:
1. Extract Job Title
2. Extract Skills from job description
3. Extract Skills from resume
4. Match and score
5. Identify missing skills
6. Provide resume improvement suggestion

--- JOB DESCRIPTION START ---
{{{jobDescription}}}
--- JOB DESCRIPTION END ---

--- RESUME START ---
{{{resume}}}
--- RESUME END ---

Return:
{
  "jobTitle": "...",
  "similarityScore": ...,
  "matchedSkills": [...],
  "missingSkills": [...],
  "suggestion": "..."
}
`,
});

const compareResumeToJobDescriptionFlow = ai.defineFlow(
  {
    name: 'compareResumeToJobDescriptionFlow',
    inputSchema: CompareResumeToJobDescriptionInputSchema,
    outputSchema: CompareResumeToJobDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await comparisonAndSuggestionPrompt(input);
    if (!output) {
      throw new Error('The AI model failed to return a valid analysis.');
    }
    return output;
  }
);

// ✅ Correctly exported function name (no self-reference issues)
export async function compareResumeAgainstJD(
  input: CompareResumeToJobDescriptionInput
): Promise<CompareResumeToJobDescriptionOutput> {
  return compareResumeToJobDescriptionFlow(input);
}
