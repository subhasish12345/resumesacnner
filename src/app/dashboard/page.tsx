'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { LogOut, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col animated-gradient">
      <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-primary">Resume Matcher</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.email}</span>
          <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center shadow-2xl">
           <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary mb-4">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome to Your Career Assistant</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                You're all set! Let's get started by analyzing your resume against a job description to see how you stack up.
              </CardDescription>
            </CardHeader>
          <CardContent>
             <Button size="lg" onClick={() => router.push('/matcher')}>
              Match Your Resume
            </Button>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center p-4 text-sm text-white/70">
        Thank you for using Resume Matcher!
      </footer>
    </div>
  );
}
