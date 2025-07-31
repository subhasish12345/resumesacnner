
'use client';

import { useState, useEffect } from 'react';
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
import { getScoreHistory, type ScoreRecord } from '@/app/actions';

export default function MatcherPage() {
  const [results, setResults] = useState<CompareResumeToJobDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<ScoreRecord[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getScoreHistory(user.uid).then(setScoreHistory);
    }
  }, [user]);

  const handleNewResult = (newResult: CompareResumeToJobDescriptionOutput) => {
    setResults(newResult);
    if(user) {
        getScoreHistory(user.uid).then(setScoreHistory);
    }
  }

  if (loading) {
    return (
     <div className="flex h-screen items-center justify-center bg-background">
       <Loader2 className="h-8 w-8 animate-spin text-primary" />
     </div>
   );
  }

  if (!user) {
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
          <ScoreHistory scores={scoreHistory} />
          <ResumeMatcherForm setResults={handleNewResult} setIsLoading={setIsLoading} />
          
          {isLoading && <AnalysisResultsSkeleton />}

          {results && !isLoading && (
            <>
                <AnalysisResults results={results} />
                <FeedbackForm />
            </>
          )}
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
