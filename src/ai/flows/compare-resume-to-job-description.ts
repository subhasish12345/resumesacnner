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
import { analyzeJobDescription } from './analyze-job-description';
import { analyzeResume } from './analyze-resume';
import { generateSuggestion } from './generate-suggestion';

const CompareResumeToJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description.'),
  resume: z.string().describe('The resume.'),
});
export type CompareResumeToJobDescriptionInput = z.infer<typeof CompareResumeToJobDescriptionInputSchema>;

const CompareResumeToJobDescriptionOutputSchema = z.object({
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
  input: {schema: z.object({
    jobDescriptionSkills: z.array(z.string()).describe('The extracted skills from the job description.'),
    resumeSkills: z.array(z.string()).describe('The extracted skills from the resume.'),
  })},
  output: {schema: CompareResumeToJobDescriptionOutputSchema},
  prompt: `You are an expert at comparing skills from a job description and a resume. Your task is to calculate a similarity score from 0 to 100 based on how many skills from the job description are present in the resume. You must also identify which skills are matched and which are missing. Finally, provide a concise, one-paragraph piece of advice to the user on how to improve their resume based on the missing skills.

Job Description Skills:
{{#each jobDescriptionSkills}}
- {{this}}
{{/each}}

Resume Skills:
{{#each resumeSkills}}
- {{this}}
{{/each}}

Please provide the results in the specified JSON format, including the similarity score, matched skills, missing skills, and a helpful suggestion.
If there are no missing skills, the suggestion should be a general tip for resume improvement.
`,
});

const compareResumeToJobDescriptionFlow = ai.defineFlow(
  {
    name: 'compareResumeToJobDescriptionFlow',
    inputSchema: CompareResumeToJobDescriptionInputSchema,
    outputSchema: CompareResumeToJobDescriptionOutputSchema,
  },
  async input => {
    const [jobAnalysis, resumeAnalysis] = await Promise.all([
        analyzeJobDescription({ jobDescription: input.jobDescription }),
        analyzeResume({ resumeText: input.resume }),
    ]);

    if (!jobAnalysis || !resumeAnalysis) {
        throw new Error('Failed to analyze job description or resume.');
    }

    const { output: result } = await comparisonAndSuggestionPrompt({
        jobDescriptionSkills: jobAnalysis.skills,
        resumeSkills: resumeAnalysis.skills,
    });
    
    if (!result) {
        throw new Error('Could not get comparison result and suggestion.');
    }
    
    return result;
  }
);
