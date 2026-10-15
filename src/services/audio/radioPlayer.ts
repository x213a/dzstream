import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioSource, type AudioStatus } from 'expo-audio';
import { useSyncExternalStore } from 'react';

import type { Channel } from '@/types';

/**
 * Lecteur radio basé sur expo-audio (compatible New Architecture).
 *
 * Un lecteur unique, créé à la demande et conservé pour toute la session : la lecture
 * continue en arrière-plan et se pilote depuis l'écran de verrouillage / la notification
 * (gérés nativement par expo-audio via `setActiveForLockScreen`).
 */

export type RadioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

let player: AudioPlayer | null = null;
let modePromise: Promise<void> | null = null;
let source: AudioSource | null = null;
/** Intention de l'utilisateur : distingue « en chargement » de « en pause ». */
let wantsPlay = false;
let status: RadioStatus = 'idle';
const listeners = new Set<() => void>();

function setStatus(next: RadioStatus) {
  if (next === status) return;
  status = next;
  listeners.forEach((l) => l());
}

function deriveStatus(s: AudioStatus): RadioStatus {
  if (!source) return 'idle';
  if (s.error) return 'error';
  if (s.playing) return 'playing';
  if (wantsPlay) return 'loading';
  return 'paused';
}

function ensureAudioMode() {
  modePromise ??= setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    // Requis pour que les contrôles de l'écran de verrouillage fonctionnent de façon fiable.
    interruptionMode: 'doNotMix',
  }).catch((e) => {
    modePromise = null;
    throw e;
  });
  return modePromise;
}

function getPlayer(): AudioPlayer {
  if (!player) {
    player = createAudioPlayer(null, { updateInterval: 1000 });
    player.addListener('playbackStatusUpdate', (s) => {
      // Lecture relancée depuis l'écran de verrouillage : on suit l'état natif.
      if (s.playing) wantsPlay = true;
      setStatus(deriveStatus(s));
    });
  }
  return player;
}

export async function playRadio(channel: Channel, subtitle: string) {
  await ensureAudioMode();
  const p = getPlayer();
  source = { uri: channel.streamUrl, headers: channel.headers };
  wantsPlay = true;
  setStatus('loading');
  p.replace(source);
  p.play();
  p.setActiveForLockScreen(
    true,
    { title: channel.name, artist: subtitle, albumTitle: 'DzStream', artworkUrl: channel.logoUrl },
    { isLiveStream: true, showSeekBackward: false, showSeekForward: false },
  );
}

export async function pauseRadio() {
  wantsPlay = false;
  player?.pause();
  if (player) setStatus(deriveStatus(player.currentStatus));
}

/** Reprend un direct : on recharge la source pour revenir au temps réel plutôt qu'au buffer. */
export async function resumeRadio() {
  if (!player || !source) return;
  wantsPlay = true;
  setStatus('loading');
  player.replace(source);
  player.play();
}

export async function stopRadio() {
  if (!player) return;
  wantsPlay = false;
  source = null;
  player.pause();
  player.clearLockScreenControls();
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
