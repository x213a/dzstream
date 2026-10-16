import { useSyncExternalStore } from 'react';

import type { Channel } from '@/types';

/**
 * Lecteur radio, version web.
 *
 * La version web d'expo-audio appelle `HTMLMediaElement.play()` sans gérer le refus
 * du navigateur (lecture automatique bloquée) : la promesse rejetée remonte en erreur
 * non interceptée. On pilote donc directement un `<audio>`, avec la même API que
 * `radioPlayer.ts`. Les en-têtes HTTP personnalisés ne sont pas applicables ici.
 */

export type RadioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

let audio: HTMLAudioElement | null = null;
let streamUrl: string | null = null;
let status: RadioStatus = 'idle';
const listeners = new Set<() => void>();

function setStatus(next: RadioStatus) {
  if (next === status) return;
  status = next;
  listeners.forEach((l) => l());
}

function getAudio(): HTMLAudioElement {
  if (!audio) {
    const a = new Audio();
    a.preload = 'none';
    a.addEventListener('waiting', () => streamUrl && setStatus('loading'));
    a.addEventListener('playing', () => setStatus('playing'));
    a.addEventListener('pause', () => streamUrl && setStatus('paused'));
    a.addEventListener('error', () => streamUrl && setStatus('error'));
    audio = a;
  }
  return audio;
}

/** (Re)charge le flux pour repartir du direct, puis lance la lecture. */
function start(url: string) {
  const a = getAudio();
  streamUrl = url;
  setStatus('loading');
  a.src = url;
  a.play().catch((e: unknown) => {
    // Lecture bloquée par le navigateur : l'utilisateur pourra relancer via « lecture ».
    if (e instanceof DOMException && e.name === 'NotAllowedError') setStatus('paused');
    else if (!(e instanceof DOMException && e.name === 'AbortError')) setStatus('error');
  });
}

export async function playRadio(channel: Channel, subtitle: string) {
  start(channel.streamUrl);
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: channel.name,
      artist: subtitle,
      album: 'Mawave',
      artwork: channel.logoUrl ? [{ src: channel.logoUrl }] : [],
    });
  }
}

export async function pauseRadio() {
  audio?.pause();
}

export async function resumeRadio() {
  if (streamUrl) start(streamUrl);
}

export async function stopRadio() {
  if (!audio) return;
  streamUrl = null;
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
  if ('mediaSession' in navigator) navigator.mediaSession.metadata = null;
  setStatus('idle');
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** État du lecteur radio, normalisé pour l'interface. */
export function useRadioStatus(): RadioStatus {
  return useSyncExternalStore(subscribe, () => status, () => 'idle' as const);
}
