'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col animated-gradient">
      <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Resume Matcher</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/auth')}>
            Sign In
          </Button>
          <Button onClick={() => router.push('/auth')}>Sign Up</Button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Find Your Perfect Job Match
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10">
            Our AI-powered tool analyzes your resume against job descriptions to give you a detailed breakdown of your compatibility. Sign up to get started!
          </p>
          <Button size="lg" onClick={() => router.push('/auth')}>
            Get Started For Free
          </Button>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-white/70">
        Powered by AI. Built for You.
      </footer>
    </div>
  );
}
