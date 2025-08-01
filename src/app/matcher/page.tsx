
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CompareResumeToJobDescriptionOutput } from '@/ai/flows/compare-resume-to-job-description';
import { ResumeMatcherForm } from '@/components/resume-matcher-form';
import { AnalysisResults } from '@/components/analysis-results';
import { AnalysisResultsSkeleton } from '@/components/analysis-results-skeleton';
import { Rocket, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FeedbackForm } from '@/components/feedback-form';
import { DeveloperInfo } from '@/components/developer-info';
import { Chatbot } from '@/components/chatbot';
import { ScoreHistory } from '@/components/score-history';
import { getScoreHistory, performMatch, type ScoreRecord } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function MatcherPage() {
  const [results, setResults] = useState<CompareResumeToJobDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<ScoreRecord[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const fetchScoreHistory = useCallback(async () => {
    if (user) {
      getScoreHistory(user.uid)
        .then(setScoreHistory)
        .catch(() => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch score history.',
          });
        });
    }
  }, [user, toast]);

  useEffect(() => {
    fetchScoreHistory();
  }, [fetchScoreHistory]);

  const handleAnalysis = async (jobDescription: string, resume: string) => {
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
      const result = await performMatch(jobDescription, resume, user.uid);
      setResults(result);
      fetchScoreHistory(); // Refresh history after new analysis
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
     <div className="flex h-screen items-center justify-center bg-background">
       <Loader2 className="h-8 w-8 animate-spin text-primary" />
     </div>
   );
  }

  if (!user) {
    // This is handled by the AuthProvider, but as a fallback
    return null;
  }

  return (
    <div className="min-h-screen animated-gradient flex flex-col">
       <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b">
         <Button variant="outline" onClick={() => router.push('/dashboard')}>
            &larr; Back to Dashboard
         </Button>
      </header>
      <main className="container mx-auto px-4 py-8 md:py-16 flex-1">
        <header className="text-center mb-12">
          <div className="inline-block p-4 bg-white/30 backdrop-blur-sm rounded-full mb-4 shadow-lg">
             <Rocket className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Resume Matcher
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Get an AI-powered analysis of how well your resume matches a job description.
          </p>
        </header>

        <div className="max-w-7xl mx-auto space-y-12">
          <ResumeMatcherForm 
            onAnalysis={handleAnalysis}
            isSubmitting={isLoading} 
          />
          
          {isLoading && <AnalysisResultsSkeleton />}

          {results && !isLoading && (
            <>
                <AnalysisResults results={results} />
                <FeedbackForm />
            </>
          )}

          <ScoreHistory scores={scoreHistory} />
        </div>
      </main>
       <Chatbot />
       <footer className="text-center p-4 text-sm text-white/70 flex items-center justify-center gap-4">
        <span>© {new Date().getFullYear()} SUBHU. All rights reserved.</span>
        <DeveloperInfo />
      </footer>
    </div>
  );
}
