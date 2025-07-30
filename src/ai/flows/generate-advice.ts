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
  prompt: `You are a helpful and experienced career coach. Your goal is to provide constructive, actionable advice to help a job seeker improve their resume.

You will be given a list of skills that are present in a job description but are missing from the candidate's resume.

Based on this list of missing skills, please generate a single paragraph of advice. The advice should be encouraging and suggest ways the candidate can highlight their experience or rephrase parts of their resume to better align with the job description.

For example, you could suggest they "Consider adding a project that demonstrates your experience with [Missing Skill]" or "To better showcase your qualifications, you could highlight your work with [Missing Skill] in your experience section."

Do not just list the missing skills. Provide real, helpful advice.

Missing Skills:
{{#each missingSkills}}
- {{this}}
{{/each}}

Your advice:
`,
});

const generateAdviceFlow = ai.defineFlow(
  {
    name: 'generateAdviceFlow',
    inputSchema: GenerateAdviceInputSchema,
    outputSchema: GenerateAdviceOutputSchema,
  },
  async input => {
    if (input.missingSkills.length === 0) {
      return {
        advice: "Your resume is a great match for the skills listed in this job description! There are no critical skills missing. You could further strengthen your application by ensuring your project descriptions and work experience clearly demonstrate your impact and achievements in your previous roles."
      };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
