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
import { generateAdvice } from './generate-advice';

const CompareResumeToJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description.'),
  resume: z.string().describe('The resume.'),
});
export type CompareResumeToJobDescriptionInput = z.infer<typeof CompareResumeToJobDescriptionInputSchema>;

const CompareResumeToJobDescriptionOutputSchema = z.object({
  similarityScore: z.number().describe('A score from 0 to 100 indicating the similarity between the resume and job description.'),
  matchedSkills: z.array(z.string()).describe('A list of skills from the job description that are present in the resume.'),
  missingSkills: z.array(z.string()).describe('A list of skills from the job description that are missing from the resume.'),
  advice: z.string().describe('A paragraph of advice on how to improve the resume.'),
});
export type CompareResumeToJobDescriptionOutput = z.infer<typeof CompareResumeToJobDescriptionOutputSchema>;

export async function compareResumeToJobDescription(input: CompareResumeToJobDescriptionInput): Promise<CompareResumeToJobDescriptionOutput> {
  return compareResumeToJobDescriptionFlow(input);
}

const comparisonAndScoringPrompt = ai.definePrompt({
  name: 'comparisonAndScoringPrompt',
  input: {schema: z.object({
    jobDescriptionSkills: z.array(z.string()).describe('The extracted skills from the job description.'),
    resumeSkills: z.array(z.string()).describe('The extracted skills from the resume.'),
  })},
  output: {schema: z.object({
    similarityScore: z.number().describe('A score from 0 to 100 indicating the similarity between the resume and job description.'),
    matchedSkills: z.array(z.string()).describe('A list of skills from the job description that are present in the resume.'),
    missingSkills: z.array(z.string()).describe('A list of skills from the job description that are missing from the resume.'),
  })},
  prompt: `Compare the following job description skills with the resume skills and calculate a similarity score from 0 to 100. Identify and list the skills from the job description that are present on the resume, and identify and list the skills from the job description that are missing from the resume.\n\nJob Description Skills: {{jobDescriptionSkills}}\n\nResume Skills: {{resumeSkills}}\n\nRespond in JSON format.`,
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

    const { output: comparisonResult } = await comparisonAndScoringPrompt({
        jobDescriptionSkills: jobAnalysis.skills,
        resumeSkills: resumeAnalysis.skills,
    });
    
    if (!comparisonResult) {
        throw new Error('Could not get comparison result');
    }

    const { output: adviceResult } = await generateAdvice({ missingSkills: comparisonResult.missingSkills });

    if (!adviceResult) {
        throw new Error('Could not generate advice');
    }

    return {
      similarityScore: comparisonResult.similarityScore,
      matchedSkills: comparisonResult.matchedSkills,
      missingSkills: comparisonResult.missingSkills,
      advice: adviceResult.advice,
    };
  }
);
