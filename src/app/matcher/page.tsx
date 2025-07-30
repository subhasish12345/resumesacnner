'use client';

import { useState } from 'react';
import type { CompareResumeToJobDescriptionOutput } from '@/ai/flows/compare-resume-to-job-description';
import { ResumeMatcherForm } from '@/components/resume-matcher-form';
import { AnalysisResults } from '@/components/analysis-results';
import { AnalysisResultsSkeleton } from '@/components/analysis-results-skeleton';
import { Rocket } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function MatcherPage() {
  const [results, setResults] = useState<CompareResumeToJobDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    // Handled by useAuth, but as a fallback
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/40">
       <header className="bg-background p-4 border-b">
         <Button variant="outline" onClick={() => router.push('/dashboard')}>
            &larr; Back to Dashboard
         </Button>
      </header>
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <div className="inline-block p-4 bg-accent rounded-full mb-4">
             <Rocket className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Resume Matcher
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get an AI-powered analysis of how well your resume matches a job description.
          </p>
        </header>

        <div className="max-w-7xl mx-auto space-y-12">
          <ResumeMatcherForm setResults={setResults} setIsLoading={setIsLoading} />
          
          {isLoading && <AnalysisResultsSkeleton />}

          {results && !isLoading && <AnalysisResults results={results} />}
        </div>
      </main>
    </div>
  );
}
