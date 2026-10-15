import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { auth, isFirebaseConfigured } from '@/services/firebase';
import * as users from '@/services/users';
import type { UserProfile } from '@/types';

interface AuthContextValue {
  /** `false` en mode démo : l'authentification est indisponible. */
  available: boolean;
  initializing: boolean;
  user: User | null;
  profile: UserProfile | null;
  isGuest: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isFavorite: (channelId: string) => boolean;
  /** Retourne `false` si l'utilisateur est invité (action non effectuée). */
  toggleFavorite: (channelId: string) => Promise<boolean>;
  addToHistory: (channelId: string) => void;
  clearHistory: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      if (!next) setProfile(null);
      setInitializing(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    let unsubscribe = () => {};
    let cancelled = false;
    users
      .ensureUserProfile(user.uid, user.email ?? '', user.displayName ?? undefined)
      .then(() => {
        if (cancelled) return;
        unsubscribe = users.subscribeUserProfile(user.uid, setProfile, (e) => console.warn('[auth] profil', e));
      })
      .catch((e) => console.warn('[auth] création du profil', e));
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('firebase-not-configured');
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    if (!auth) throw new Error('firebase-not-configured');
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const name = displayName?.trim();
    if (name) await updateProfile(cred.user, { displayName: name });
    await users.ensureUserProfile(cred.user.uid, cred.user.email ?? '', name);
  }, []);

  const signOut = useCallback(async () => {
    if (auth) await firebaseSignOut(auth);
  }, []);

  const isFavorite = useCallback((channelId: string) => profile?.favorites.includes(channelId) ?? false, [profile]);

  const toggleFavorite = useCallback(
    async (channelId: string) => {
      if (!user || !profile) return false;
      await users.setFavorite(user.uid, channelId, !profile.favorites.includes(channelId));
      return true;
    },
    [user, profile],
  );

  const addToHistory = useCallback(
    (channelId: string) => {
      if (!user || !profile) return;
      users.recordHistory(user.uid, profile.history, channelId).catch((e) => console.warn('[auth] historique', e));
    },
    [user, profile],
  );

  const clearHistory = useCallback(async () => {
    if (user) await users.clearHistory(user.uid);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      available: isFirebaseConfigured,
      initializing,
      user,
      profile,
      isGuest: !user,
      isAdmin: profile?.role === 'admin',
      signIn,
      signUp,
      signOut,
      isFavorite,
      toggleFavorite,
      addToHistory,
      clearHistory,
    }),
    [initializing, user, profile, signIn, signUp, signOut, isFavorite, toggleFavorite, addToHistory, clearHistory],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}

/** Associe un code d'erreur Firebase Auth à une clé de traduction. */
export function authErrorKey(error: unknown) {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-email':
      return 'auth.errors.invalidEmail' as const;
    case 'auth/weak-password':
      return 'auth.errors.weakPassword' as const;
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'auth.errors.invalidCredentials' as const;
    case 'auth/email-already-in-use':
      return 'auth.errors.emailInUse' as const;
    case 'auth/network-request-failed':
      return 'auth.errors.network' as const;
    default:
      return 'auth.errors.generic' as const;
  }
}
