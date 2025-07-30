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
  similarityScore: z.number().describe('A score from 0 to 100 indicating the similarity between the resume and job description.'),
  matchedSkills: z.array(z.string()).describe('A list of skills from the job description that are present in the resume.'),
  missingSkills: z.array(z.string()).describe('A list of skills from the job description that are missing from the resume.'),
  advice: z.string().describe('A paragraph of advice on how to improve the resume.'),
});
export type CompareResumeToJobDescriptionOutput = z.infer<typeof CompareResumeToJobDescriptionOutputSchema>;

export async function compareResumeToJobDescription(input: CompareResumeToJobDescriptionInput): Promise<CompareResumeToJobDescriptionOutput> {
  return compareResumeToJobDescriptionFlow(input);
}

const jobDescriptionAnalysisPrompt = ai.definePrompt({
  name: 'jobDescriptionAnalysisPrompt',
  input: {schema: CompareResumeToJobDescriptionInputSchema},
  prompt: `Extract a list of all technical skills, qualifications, and responsibilities from the following job description:\n\n{{jobDescription}}`,
});

const resumeAnalysisPrompt = ai.definePrompt({
  name: 'resumeAnalysisPrompt',
  input: {schema: CompareResumeToJobDescriptionInputSchema},
  prompt: `Extract a list of all technical skills and projects from the following resume:\n\n{{resume}}`,
});

const comparisonAndScoringPrompt = ai.definePrompt({
  name: 'comparisonAndScoringPrompt',
  input: {schema: z.object({
    jobDescriptionSkills: z.string().describe('The extracted skills, qualifications, and responsibilities from the job description.'),
    resumeSkills: z.string().describe('The extracted skills and projects from the resume.'),
  })},
  output: {schema: z.object({
    similarityScore: z.number().describe('A score from 0 to 100 indicating the similarity between the resume and job description.'),
    matchedSkills: z.array(z.string()).describe('A list of skills from the job description that are present in the resume.'),
    missingSkills: z.array(z.string()).describe('A list of skills from the job description that are missing from the resume.'),
  })},
  prompt: `Compare the following job description skills with the resume skills and calculate a similarity score from 0 to 100. Identify and list the skills from the job description that are present on the resume, and identify and list the skills from the job description that are missing from the resume.\n\nJob Description Skills: {{jobDescriptionSkills}}\n\nResume Skills: {{resumeSkills}}\n\nRespond in JSON format.`, // Requesting JSON format for structured output
});

const suggestionGenerationPrompt = ai.definePrompt({
  name: 'suggestionGenerationPrompt',
  input: {schema: z.object({
    missingSkills: z.array(z.string()).describe('A list of skills missing from the resume.'),
  })},
  output: {schema: z.object({
    advice: z.string().describe('A paragraph of advice on how to improve the resume.'),
  })},
  prompt: `Generate a paragraph of advice on how to improve the resume, focusing on the following missing skills:\n\n{{missingSkills}}`,
});

const compareResumeToJobDescriptionFlow = ai.defineFlow(
  {
    name: 'compareResumeToJobDescriptionFlow',
    inputSchema: CompareResumeToJobDescriptionInputSchema,
    outputSchema: CompareResumeToJobDescriptionOutputSchema,
  },
  async input => {
    const jobDescriptionSkillsResponse = await jobDescriptionAnalysisPrompt(input);
    const resumeSkillsResponse = await resumeAnalysisPrompt(input);

    const comparisonInput = {
      jobDescriptionSkills: jobDescriptionSkillsResponse.output!,
      resumeSkills: resumeSkillsResponse.output!,
    };
    const comparisonResponse = await comparisonAndScoringPrompt({
      jobDescriptionSkills: comparisonInput.jobDescriptionSkills as any, // force conversion to string
      resumeSkills: comparisonInput.resumeSkills as any, // force conversion to string
    });

    const suggestionInput = {
      missingSkills: comparisonResponse.output!.missingSkills,
    };
    const suggestionResponse = await suggestionGenerationPrompt(suggestionInput as any); // missing skills is an array

    return {
      similarityScore: comparisonResponse.output!.similarityScore,
      matchedSkills: comparisonResponse.output!.matchedSkills,
      missingSkills: comparisonResponse.output!.missingSkills,
      advice: suggestionResponse.output!.advice,
    };
  }
);
