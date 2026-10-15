import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

import type { HistoryEntry, UserProfile } from '@/types';

import { COLLECTIONS, db } from './firebase';

const HISTORY_LIMIT = 20;

function requireDb() {
  if (!db) throw new Error('firebase-not-configured');
  return db;
}

const userRef = (uid: string) => doc(requireDb(), COLLECTIONS.users, uid);

/**
 * Crée le profil à la première connexion. Le rôle est toujours `user` à la création :
 * la promotion en `admin` se fait uniquement côté console Firebase (voir firestore.rules).
 */
export async function ensureUserProfile(uid: string, email: string, displayName?: string) {
  const ref = userRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { email, displayName: displayName ?? null, role: 'user', favorites: [], history: [] });
  }
}

export function subscribeUserProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError: (e: Error) => void,
) {
  return onSnapshot(
    userRef(uid),
    (snap) => {
      const data = snap.data();
      if (!data) return onData(null);
      onData({
        uid,
        email: data.email ?? '',
        displayName: data.displayName ?? undefined,
        role: data.role === 'admin' ? 'admin' : 'user',
        favorites: Array.isArray(data.favorites) ? data.favorites : [],
        history: Array.isArray(data.history) ? data.history : [],
      });
    },
    onError,
  );
}

export async function setFavorite(uid: string, channelId: string, favorite: boolean) {
  await updateDoc(userRef(uid), { favorites: favorite ? arrayUnion(channelId) : arrayRemove(channelId) });
}

export async function recordHistory(uid: string, current: HistoryEntry[], channelId: string) {
  const history = [{ channelId, at: Date.now() }, ...current.filter((h) => h.channelId !== channelId)].slice(
    0,
    HISTORY_LIMIT,
  );
  await updateDoc(userRef(uid), { history });
}

export async function clearHistory(uid: string) {
  await updateDoc(userRef(uid), { history: [] });
}
