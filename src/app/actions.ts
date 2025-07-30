'use server';

import { compareResumeToJobDescription, type CompareResumeToJobDescriptionOutput } from '@/ai/flows/compare-resume-to-job-description';
import { chat, type ChatInput, type ChatOutput } from '@/ai/flows/chatbot';

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

export async function performChat(input: ChatInput): Promise<ChatOutput> {
    if (!input.message || input.message.length === 0) {
        throw new Error('Message cannot be empty.');
    }
    if (input.message.length > 2000) {
        throw new Error('Message cannot exceed 2000 characters.');
    }

    try {
        const result = await chat(input);
        return result;
    } catch (e) {
        console.error(e);
        throw new Error('An unexpected error occurred with the chatbot. Please try again later.');
    }
}
