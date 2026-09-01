import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AppUser } from '../types';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(
      auth, 
      async (currentUser) => {
        if (!isMounted) return;
        setUser(currentUser);
        
        if (currentUser) {
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (isMounted) {
              if (userSnap.exists()) {
                setAppUser(userSnap.data() as AppUser);
              } else {
                const newUser: AppUser = {
                  uid: currentUser.uid,
                  email: currentUser.email || '',
                  role: 'user',
                  createdAt: serverTimestamp() as any
                };
                await setDoc(userRef, newUser);
                setAppUser(newUser);
              }
            }
          } catch (error) {
            console.error("Error loading user profile:", error);
          }
        } else {
          if (isMounted) setAppUser(null);
        }
        
        if (isMounted) setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        if (isMounted) setLoading(false);
      }
    );

    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, signOut }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-400">Loading Milestone...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
