'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { performMatch } from '@/app/actions';
import type { CompareResumeToJobDescriptionOutput } from '@/ai/flows/compare-resume-to-job-description';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  jobDescription: z.string().min(100, { message: 'Job description must be at least 100 characters.' }).max(15000, { message: 'Job description cannot exceed 15,000 characters.'}),
  resume: z.string().min(100, { message: 'Resume must be at least 100 characters.' }).max(15000, { message: 'Resume cannot exceed 15,000 characters.'}),
});

type ResumeMatcherFormProps = {
  setResults: (results: CompareResumeToJobDescriptionOutput | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export function ResumeMatcherForm({ setResults, setIsLoading }: ResumeMatcherFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      jobDescription: '',
      resume: '',
    },
  });
  const { toast } = useToast();
  const { user } = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Not Authenticated',
            description: 'You must be signed in to perform a match.',
        });
        return;
    }
    setIsLoading(true);
    setResults(null);
    try {
      const result = await performMatch(values.jobDescription, values.resume, user.uid);
      setResults(result);
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Start Your Analysis</CardTitle>
        <CardDescription>Paste the full job description and your resume text into the fields below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the complete job description here..."
                        className="min-h-[300px] md:min-h-[400px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Your Resume</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your full resume text here..."
                        className="min-h-[300px] md:min-h-[400px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center pt-4">
              <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Match Resume'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
