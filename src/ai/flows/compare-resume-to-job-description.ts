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
  prompt: `You are an expert at comparing skills from a job description and a resume. Your task is to perform the following actions:
1.  Calculate a similarity score from 0 to 100. The score is based on the percentage of skills from the job description that are also found in the resume. For example, if 8 out of 10 job skills are in the resume, the score should be 80.
2.  Identify which skills from the job description are present in the resume (matchedSkills).
3.  Identify which skills from the job description are NOT in the resume (missingSkills).
4.  Provide a concise, one-paragraph piece of advice to the user on how to improve their resume based on the missing skills. If there are no missing skills, the suggestion should be a general tip for resume improvement.

Job Description Skills:
{{#each jobDescriptionSkills}}
- {{this}}
{{/each}}

Resume Skills:
{{#each resumeSkills}}
- {{this}}
{{/each}}

Please provide the results in the specified JSON format. Ensure all fields (similarityScore, matchedSkills, missingSkills, suggestion) are populated correctly based on your analysis.
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

    if (!jobAnalysis || !jobAnalysis.skills || !resumeAnalysis || !resumeAnalysis.skills) {
        throw new Error('Failed to analyze job description or resume. One or more analysis steps returned no data.');
    }

    const { output: result } = await comparisonAndSuggestionPrompt({
        jobDescriptionSkills: jobAnalysis.skills,
        resumeSkills: resumeAnalysis.skills,
    });
    
    if (!result || result.similarityScore === undefined) {
        throw new Error('The AI model failed to return a valid comparison. Please try again.');
    }
    
    return result;
  }
);
