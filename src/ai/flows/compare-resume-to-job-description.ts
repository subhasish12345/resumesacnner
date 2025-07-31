'use server';
/**
 * @fileOverview Compares a resume to a job description and provides a similarity score and suggestions.
 *
 * - compareResumeToJobDescription - A function that compares the resume and job description.
 * - CompareResumeToJobDescriptionInput - The input type for the compareResumeToJobDescription function.
 * - CompareResumeToJobDescriptionOutput - The return type for the compareResumeToJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareResumeToJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description.'),
  resume: z.string().describe('The resume.'),
});
export type CompareResumeToJobDescriptionInput = z.infer<typeof CompareResumeToJobDescriptionInputSchema>;

const CompareResumeToJobDescriptionOutputSchema = z.object({
  jobTitle: z.string().describe("The job title extracted from the job description."),
  similarityScore: z.number().describe('A score from 0 to 100 indicating the similarity between the resume and job description.'),
  matchedSkills: z.array(z.string()).describe('A list of skills from the job description that are present in the resume.'),
  missingSkills: z.array(z.string()).describe('A list of skills from the job description that are missing from the resume.'),
  suggestion: z.string().describe('AI-generated advice on how to improve the resume.'),
});
export type CompareResumeToJobDescriptionOutput = z.infer<typeof CompareResumeToJobDescriptionOutputSchema>;

export async function compareResumeToJobDescription(input: CompareResumeToJobDescriptionInput): Promise<CompareResumeToJobDescriptionOutput> {
  return compareResumeToJobDescriptionFlow(input);
}

const comparisonAndSuggestionPrompt = ai.definePrompt({
  name: 'comparisonAndSuggestionPrompt',
  input: {schema: CompareResumeToJobDescriptionInputSchema},
  output: {schema: CompareResumeToJobDescriptionOutputSchema},
  prompt: `You are an expert HR analyst. Your task is to analyze the provided job description and resume, then return a detailed analysis in JSON format.

Perform the following steps:
1.  **Extract Job Title**: Identify the job title from the job description. If none is found, return "Unknown".
2.  **Extract Skills**: Identify the key skills and qualifications required by the job description.
3.  **Analyze Resume**: Identify the skills present in the resume.
4.  **Compare and Score**: Compare the skills from the job description against the resume. Calculate a similarity score from 0 to 100, where the score represents the percentage of required skills found in the resume. For example, if 8 out of 10 job skills are in the resume, the score is 80.
5.  **Identify Skill Gaps**: Create a list of skills from the job description that are missing from the resume.
6.  **Generate Suggestion**: Provide a concise, one-paragraph piece of advice to the user on how to improve their resume based on the missing skills. If there are no missing skills, the suggestion should be a general tip for resume improvement.

Here is the job description:
--- JOB DESCRIPTION START ---
{{{jobDescription}}}
--- JOB DESCRIPTION END ---

Here is the resume:
--- RESUME START ---
{{{resume}}}
--- RESUME END ---

Please provide the results in the specified JSON format. Ensure all fields (jobTitle, similarityScore, matchedSkills, missingSkills, suggestion) are populated correctly based on your analysis.
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
