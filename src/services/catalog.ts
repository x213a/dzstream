import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
  type DocumentData,
} from 'firebase/firestore';

import { SEED_CATEGORIES, SEED_CHANNELS } from '@/data/seed';
import type { Category, Channel } from '@/types';

import { COLLECTIONS, db } from './firebase';

/**
 * Accès au catalogue (chaînes + catégories).
 *
 * Firestore est la source de vérité : les écouteurs `onSnapshot` propagent en temps
 * réel toute modification faite depuis le panneau d'administration (nouvelle URL de
 * flux, chaîne désactivée…), sans redéploiement de l'application.
 */

type Unsubscribe = () => void;

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

function toChannel(id: string, data: DocumentData): Channel {
  return {
    id,
    name: String(data.name ?? ''),
    nameAr: data.nameAr || undefined,
    type: data.type === 'radio' ? 'radio' : 'tv',
    streamUrl: String(data.streamUrl ?? ''),
    logoUrl: data.logoUrl || undefined,
    categoryId: String(data.categoryId ?? ''),
    description: data.description || undefined,
    order: Number(data.order ?? 0),
    isActive: data.isActive !== false,
    headers: data.headers || undefined,
    updatedAt: data.updatedAt?.toMillis?.(),
  };
}

function toCategory(id: string, data: DocumentData): Category {
  return {
    id,
    name: data.name ?? { fr: id },
    type: data.type === 'tv' || data.type === 'radio' ? data.type : 'both',
    order: Number(data.order ?? 0),
  };
}

export function subscribeChannels(onData: (channels: Channel[]) => void, onError: (e: Error) => void): Unsubscribe {
  if (!db) {
    onData([...SEED_CHANNELS].sort(byOrder));
    return () => {};
  }
  return onSnapshot(
    collection(db, COLLECTIONS.channels),
    (snap) => onData(snap.docs.map((d) => toChannel(d.id, d.data())).sort(byOrder)),
    onError,
  );
}

export function subscribeCategories(onData: (categories: Category[]) => void, onError: (e: Error) => void): Unsubscribe {
  if (!db) {
    onData([...SEED_CATEGORIES].sort(byOrder));
    return () => {};
  }
  return onSnapshot(
    collection(db, COLLECTIONS.categories),
    (snap) => onData(snap.docs.map((d) => toCategory(d.id, d.data())).sort(byOrder)),
    onError,
  );
}

function requireDb() {
  if (!db) throw new Error('firebase-not-configured');
  return db;
}

/** Firestore refuse `undefined` : on retire les champs vides. */
function clean<T extends object>(value: T): DocumentData {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined));
}

export async function saveChannel(channel: Channel): Promise<void> {
  const { id, updatedAt: _ignored, ...data } = channel;
  await setDoc(doc(requireDb(), COLLECTIONS.channels, id), { ...clean(data), updatedAt: serverTimestamp() });
}

export async function deleteChannel(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTIONS.channels, id));
}

export async function saveCategory(category: Category): Promise<void> {
  const { id, ...data } = category;
  await setDoc(doc(requireDb(), COLLECTIONS.categories, id), clean(data));
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), COLLECTIONS.categories, id));
}

/** Importe (ou met à jour) le catalogue initial en une seule écriture atomique. */
export async function importSeedCatalog(): Promise<void> {
  const firestore = requireDb();
  const batch = writeBatch(firestore);
  for (const { id, ...data } of SEED_CATEGORIES) {
    batch.set(doc(firestore, COLLECTIONS.categories, id), clean(data), { merge: true });
  }
  for (const { id, updatedAt: _ignored, ...data } of SEED_CHANNELS) {
    batch.set(doc(firestore, COLLECTIONS.channels, id), { ...clean(data), updatedAt: serverTimestamp() }, { merge: true });
  }
  await batch.commit();
}
