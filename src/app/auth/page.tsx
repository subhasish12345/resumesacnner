
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      await signUp(values.email, values.password);
      toast({ title: 'Sign up successful! Redirecting...' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      await signIn(values.email, values.password);
      toast({ title: 'Sign in successful! Redirecting...' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      toast({ title: 'Google sign in successful! Redirecting...'});
      router.push('/dashboard');
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Google Sign In Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 animated-gradient">
      <div className="flex flex-col md:flex-row w-full max-w-4xl md:max-h-[700px] overflow-hidden rounded-2xl shadow-2xl">
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 text-white p-12 bg-primary/80 backdrop-blur-sm">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-center">Unlock Your Career Potential</h1>
          <p className="text-lg mb-8 text-center max-w-md">Our AI-powered tools analyze your resume against job descriptions to give you the edge you need.</p>
          <div className="w-full max-w-sm">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M37,-49.9C51.5,-42,69.4,-33.3,77.5,-20.1C85.6,-6.9,83.9,10.9,76,25.3C68.1,39.7,54.1,50.7,39.4,58.8C24.7,66.9,9.4,72,-5.3,73.5C-20,75,-40.1,72.9,-54.2,63.9C-68.3,54.9,-76.4,39,-77.9,23C-79.4,7,-74.3,-9.1,-66.2,-23.1C-58.1,-37.1,-47,-49,-34.5,-56.9C-22,-64.8,-8.1,-68.6,4.6,-65.7C17.3,-62.7,37,-49.9,37,-49.9Z" transform="translate(100 100)" opacity="0.1" />
              <foreignObject x="15" y="25" width="170" height="150">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                      <div className="flex items-center gap-3">
                          <div className="bg-primary/80 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                          </div>
                          <p className="font-bold text-sm text-white">resume_final.pdf</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex-1">
                          <div className="h-2 bg-primary/30 rounded-full w-full">
                             <div className="h-2 bg-primary rounded-full w-[92%]"></div>
                          </div>
                          <p className="text-xs text-white/80 mt-1">92% Match - Outstanding!</p>
                        </div>
                        <div className="ml-4 bg-white/20 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 6 9 17l-5-5"></path></svg>
                        </div>
                      </div>
                  </div>
              </foreignObject>
            </svg>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-background">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Card className="border-0 shadow-none rounded-none">
                <CardHeader>
                  <CardTitle>Welcome Back!</CardTitle>
                  <CardDescription>
                    Sign in to continue your journey.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...signInForm}>
                    <form
                      onSubmit={signInForm.handleSubmit(handleSignIn)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="you@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                      </Button>
                    </form>
                  </Form>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" role="img" aria-label="Google logo">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.844 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                    </svg>
                    Sign In with Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card className="border-0 shadow-none rounded-none">
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Join us and take the next step in your career.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...signUpForm}>
                    <form
                      onSubmit={signUpForm.handleSubmit(handleSignUp)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="you@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                      </Button>
                    </form>
                  </Form>
                     <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" role="img" aria-label="Google logo">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.844 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                    </svg>
                    Sign Up with Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
