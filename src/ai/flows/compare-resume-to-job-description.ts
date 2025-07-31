
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
  prompt: `You are an expert HR analyst. Your task is to analyze the provided job description and resume.
  
Follow these steps carefully:
1.  Read the job description to understand the required skills and qualifications.
2.  Read the resume to identify the candidate's skills and experience.
3.  Compare the resume against the job description.
4.  Calculate a similarity score from 0 to 100.
5.  Identify which required skills are present in the resume (matchedSkills).
6.  Identify which required skills are missing from the resume (missingSkills).
7.  Generate a helpful, one-paragraph suggestion for how the candidate could improve their resume for this specific job.
8.  Extract the specific job title from the job description.

Job Description:
\`\`\`
{{{jobDescription}}}
\`\`\`

Resume:
\`\`\`
{{{resume}}}
\`\`\`

IMPORTANT: Your final output must be ONLY the JSON object that adheres to the output schema. Do not include any other text, markdown formatting, or explanations.
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
    console.log('AI output from flow:', JSON.stringify(output, null, 2));
    return output;
  }
);

export async function compareResumeAgainstJD(
  input: CompareResumeToJobDescriptionInput
): Promise<CompareResumeToJobDescriptionOutput> {
  return compareResumeToJobDescriptionFlow(input);
}
