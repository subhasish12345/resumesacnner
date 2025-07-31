
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string
  ) => Promise<any>;
  signIn: (
    email: string,
    password: string
  ) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/auth', '/'];
const privateRoutes = ['/dashboard', '/matcher'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs only on the client, after the component mounts.
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    if (loading || !isClient) return;

    const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

    if (!user && isPrivateRoute) {
      router.push('/auth');
    } else if (user && (pathname === '/auth' || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [user, loading, router, pathname, isClient]);
  
  const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        setUser(null);
        router.push('/');
    } catch (error) {
        console.error("Sign Out Error", error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      router.push('/dashboard');
      return result.user;
    } catch (error) {
      console.error('Google Sign In Error', error);
      throw error;
    }
  };
  
    const handleAuthAction = async (
    action: (...args: any[]) => Promise<any>,
    ...args: any[]
  ) => {
    try {
      const result = await action(...args);
      router.push('/dashboard');
      return result;
    } catch (error) {
      console.error('Auth Error:', error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp: (email, password) => handleAuthAction(createUserWithEmailAndPassword, auth, email, password),
      signIn: (email, password) => handleAuthAction(signInWithEmailAndPassword, auth, email, password),
      signOut,
      signInWithGoogle,
    }),
    [user, loading]
  );
  
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  // While loading, or if not on the client yet, show a loading spinner to prevent hydration mismatch
  if (loading || !isClient) {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If it's a private route and the user is not authenticated (and we're on the client),
  // show a loader while the redirect is in progress.
  if(isPrivateRoute && !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
