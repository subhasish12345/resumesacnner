'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  if (!user) {
    // This should be handled by the useAuth hook's redirect, but as a fallback
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <h1 className="text-xl font-bold text-primary">Resume Matcher</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.email}</span>
          <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Welcome to Your Career Assistant
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            You're all set! Let's get started by analyzing your resume against a job description to see how you stack up.
          </p>
          <Button size="lg" onClick={() => router.push('/matcher')}>
            Match Your Resume
          </Button>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        Thank you for using Resume Matcher!
      </footer>
    </div>
  );
}
