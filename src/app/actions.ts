'use server';

import { compareResumeToJobDescription, type CompareResumeToJobDescriptionOutput } from '@/ai/flows/compare-resume-to-job-description';

export async function performMatch(jobDescription: string, resume: string): Promise<CompareResumeToJobDescriptionOutput> {
  if (!jobDescription || jobDescription.length < 100) {
    throw new Error('Job description must be at least 100 characters.');
  }
   if (jobDescription.length > 15000) {
    throw new Error('Job description cannot exceed 15,000 characters.');
  }
  if (!resume || resume.length < 100) {
    throw new Error('Resume must be at least 100 characters.');
  }
  if (resume.length > 15000) {
    throw new Error('Resume cannot exceed 15,000 characters.');
  }

  try {
    const result = await compareResumeToJobDescription({
      jobDescription,
      resume,
    });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('An unexpected error occurred during analysis. Please try again later.');
  }
}
