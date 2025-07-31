
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicRoutes.some((route) => pathname === route);
    const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

    if (!user && isPrivateRoute) {
      router.push('/auth');
    } else if (user && (pathname === '/auth' || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [user, loading, router, pathname]);
  
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
      setUser(result.user);
      router.push('/dashboard');
      return result.user;
    } catch (error) {
      console.error('Google Sign In Error', error);
      return null;
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

  if (loading || (isPrivateRoute && !user)) {
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
