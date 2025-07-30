'use server';

/**
 * @fileOverview A conversational AI chatbot flow.
 *
 * - chat - A function that handles the chatbot conversation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ChatInput, ChatOutput } from '@/app/actions';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});

const ChatOutputSchema = z.string();

const chatPrompt = ai.definePrompt({
    name: 'chatbotPrompt',
    input: { schema: ChatInputSchema },
    output: { schema: ChatOutputSchema },
    prompt: `You are a friendly and helpful career assistant chatbot. Your name is 'Resume Bot'.
    Your goal is to provide helpful, concise, and encouraging advice to users about their resumes, job applications, and career questions.
    Keep your answers friendly and to the point.

    Here is the conversation history so far:
    {{#each history}}
    {{role}}: {{content}}
    {{/each}}

    Here is the user's latest message:
    user: {{message}}

    Your response:
    `,
});


export async function chat(input: ChatInput): Promise<ChatOutput> {
  const { output } = await chatPrompt(input);
  return output ?? "I'm sorry, I couldn't come up with a response.";
}
