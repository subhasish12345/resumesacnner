// This file defines a Genkit flow that generates personalized advice for improving a resume based on missing skills.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdviceInputSchema = z.object({
  missingSkills: z.array(z.string()).describe('A list of skills missing from the resume.'),
});
export type GenerateAdviceInput = z.infer<typeof GenerateAdviceInputSchema>;

const GenerateAdviceOutputSchema = z.object({
  advice: z.string().describe('A paragraph of personalized advice for improving the resume.'),
});
export type GenerateAdviceOutput = z.infer<typeof GenerateAdviceOutputSchema>;

export async function generateAdvice(input: GenerateAdviceInput): Promise<GenerateAdviceOutput> {
  return generateAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdvicePrompt',
  input: {schema: GenerateAdviceInputSchema},
  output: {schema: GenerateAdviceOutputSchema},
  prompt: `You are a resume expert. Given the following list of skills missing from a resume, generate a paragraph of personalized advice on how to improve the resume to better match the job description.\n\nMissing Skills: {{#each missingSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}\n\nAdvice: `,
});

const generateAdviceFlow = ai.defineFlow(
  {
    name: 'generateAdviceFlow',
    inputSchema: GenerateAdviceInputSchema,
    outputSchema: GenerateAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
