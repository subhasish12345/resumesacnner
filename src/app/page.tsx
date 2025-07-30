'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <h1 className="text-xl font-bold text-primary">Resume Matcher</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/auth')}>
            Sign In
          </Button>
          <Button onClick={() => router.push('/auth')}>Sign Up</Button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Find Your Perfect Job Match
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our AI-powered tool analyzes your resume against job descriptions to give you a detailed breakdown of your compatibility. Sign up to get started!
          </p>
          <Button size="lg" onClick={() => router.push('/auth')}>
            Get Started
          </Button>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        Powered by AI. Built for You.
      </footer>
    </div>
  );
}
