
'use server';

import {
  compareResumeAgainstJD,
  type CompareResumeToJobDescriptionOutput,
} from '@/ai/flows/compare-resume-to-job-description';
import { chat } from '@/ai/flows/chatbot';
import type { ChatInput, ChatOutput } from '@/components/chatbot';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export type ScoreRecord = {
  id?: string;
  userId: string;
  score: number;
  jobTitle: string;
  date: string;
};

export async function performMatch(
  jobDescription: string,
  resume: string,
  userId: string
): Promise<CompareResumeToJobDescriptionOutput> {
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
    const result = await compareResumeAgainstJD({
      jobDescription,
      resume,
    });

    if (result?.similarityScore === undefined || !result.jobTitle) {
      throw new Error('The AI model failed to return a valid analysis.');
    }

    await addDoc(collection(db, 'scores'), {
      userId: userId,
      score: result.similarityScore,
      jobTitle: result.jobTitle,
      createdAt: Timestamp.now(),
    });

    return result;
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    throw new Error(`Analysis failed: ${errorMessage}`);
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
    throw new Error(
      'An unexpected error occurred with the chatbot. Please try again later.'
    );
  }
}

export async function getScoreHistory(userId: string): Promise<ScoreRecord[]> {
  try {
    const q = query(
      collection(db, 'scores'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const scores: ScoreRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        userId: data.userId,
        score: data.score,
        jobTitle: data.jobTitle,
        date: (data.createdAt as Timestamp).toDate().toLocaleDateString(),
      });
    });
    return scores;
  } catch (error) {
    console.error('Error fetching score history:', error);
    throw new Error('Failed to fetch score history.');
  }
}
