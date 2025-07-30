'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-job-description.ts';
import '@/ai/flows/analyze-resume.ts';
import '@/ai/flows/compare-resume-to-job-description.ts';
import '@/ai/flows/chatbot.ts';
import '@/ai/flows/generate-suggestion.ts';
import '@/ai/flows/extract-job-title.ts';
