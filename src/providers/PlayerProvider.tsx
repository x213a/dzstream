import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocalized } from '@/i18n';
import { pauseRadio, playRadio, resumeRadio, stopRadio, useRadioStatus } from '@/services/audio/radioPlayer';
import type { Channel } from '@/types';

import { useAuth } from './AuthProvider';
import { useCatalog } from './CatalogProvider';

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface PlayerContextValue {
  /** Chaîne en cours, toujours à jour avec le catalogue (URL modifiée par un admin…). */
  current: Channel | null;
  status: PlayerStatus;
  play: (channel: Channel) => void;
  togglePause: () => void;
  stop: () => void;
  /** TV : `true` quand un grand lecteur (fiche ou plein écran) est affiché ; le mini-lecteur masque alors sa vidéo. */
  fullscreen: boolean;
  /** Chaque grand lecteur se déclare à l'affichage (`true`) et se retire en disparaissant (`false`). */
  setFullscreen: (open: boolean) => void;
  /** TV : remontée d'état depuis le composant `<Video>`. */
  reportVideoStatus: (status: PlayerStatus) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { text, channelName } = useLocalized();
  const { getChannel, getCategory } = useCatalog();
  const { addToHistory } = useAuth();

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<Channel | null>(null);
  const [videoStatus, setVideoStatus] = useState<PlayerStatus>('idle');
  // Compteur : la fiche TV et le lecteur plein écran peuvent être empilés.
  const [videoHosts, setVideoHosts] = useState(0);
  const fullscreen = videoHosts > 0;
  const setFullscreen = useCallback((open: boolean) => setVideoHosts((n) => Math.max(0, n + (open ? 1 : -1))), []);
  const radioStatus = useRadioStatus();

  // On privilégie la version du catalogue (temps réel) ; sinon la copie au lancement.
  const current = (currentId && getChannel(currentId)) || snapshot;

  const subtitle = useCallback(
    (channel: Channel) => text(getCategory(channel.categoryId)?.name) || t('common.radio'),
    [getCategory, text, t],
  );

  const play = useCallback(
    (channel: Channel) => {
      setCurrentId(channel.id);
      setSnapshot(channel);
      addToHistory(channel.id);
      if (channel.type === 'radio') {
        setVideoStatus('idle');
        playRadio({ ...channel, name: channelName(channel) }, subtitle(channel)).catch((e) => {
          console.warn('[player] radio', e);
        });
      } else {
        setVideoStatus('loading');
        stopRadio().catch(() => undefined);
      }
    },
    [addToHistory, channelName, subtitle],
  );

  // Si un admin change l'URL d'une radio en cours d'écoute, on bascule sur le nouveau flux.
  const lastRadioUrl = useRef<string | null>(null);
  useEffect(() => {
    if (current?.type !== 'radio') {
      lastRadioUrl.current = null;
      return;
    }
    if (lastRadioUrl.current && lastRadioUrl.current !== current.streamUrl) {
      playRadio({ ...current, name: channelName(current) }, subtitle(current)).catch(() => undefined);
    }
    lastRadioUrl.current = current.streamUrl;
  }, [current, channelName, subtitle]);

  const status: PlayerStatus = !current ? 'idle' : current.type === 'radio' ? radioStatus : videoStatus;

  const togglePause = useCallback(() => {
    if (!current) return;
    if (current.type === 'radio') {
      (status === 'playing' || status === 'loading' ? pauseRadio() : resumeRadio()).catch(() => undefined);
    } else {
      setVideoStatus((s) => (s === 'paused' ? 'loading' : 'paused'));
    }
  }, [current, status]);

  const stop = useCallback(() => {
    if (current?.type === 'radio') stopRadio().catch(() => undefined);
    setCurrentId(null);
    setSnapshot(null);
    setVideoStatus('idle');
  }, [current]);

  const reportVideoStatus = useCallback((next: PlayerStatus) => {
    // Une pause demandée par l'utilisateur prime sur les événements du lecteur.
    setVideoStatus((prev) => (prev === 'paused' && next !== 'error' ? prev : next));
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({ current, status, play, togglePause, stop, fullscreen, setFullscreen, reportVideoStatus }),
    [current, status, play, togglePause, stop, fullscreen, setFullscreen, reportVideoStatus],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer doit être utilisé dans <PlayerProvider>');
  return ctx;
}
