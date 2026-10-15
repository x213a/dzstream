import HlsPlayer, { Events } from 'hls.js';
import { useEffect, useRef } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { PlayerStatus } from '@/providers/PlayerProvider';
import type { Channel } from '@/types';

interface LiveVideoProps {
  channel: Channel;
  paused: boolean;
  controls?: boolean;
  onStatus: (status: PlayerStatus) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Lecteur HLS (.m3u8) des chaînes TV, version web.
 *
 * Sur le web, react-native-video se contente d'un `<video src>` : la plupart des
 * navigateurs de bureau ne lisent pas le HLS nativement. On passe donc par hls.js
 * (Media Source Extensions), avec repli sur le HLS natif (Safari).
 */
export function LiveVideo({ channel, paused, controls, onStatus, style }: LiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Les callbacks changent à chaque rendu : on garde le dernier sans relancer le flux.
  const onStatusRef = useRef(onStatus);
  useEffect(() => {
    onStatusRef.current = onStatus;
  });

  const { streamUrl, headers, id } = channel;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const report = (status: PlayerStatus) => onStatusRef.current(status);
    const fail = (detail: unknown) => {
      console.warn('[video]', id, detail);
      report('error');
    };

    const onWaiting = () => report('loading');
    const onPlaying = () => report('playing');
    const onError = () => fail(video.error);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('error', onError);

    report('loading');
    let hls: HlsPlayer | null = null;
    if (HlsPlayer.isSupported()) {
      hls = new HlsPlayer({
        xhrSetup: (xhr) => {
          for (const [name, value] of Object.entries(headers ?? {})) {
            // Le navigateur interdit certains en-têtes (User-Agent, Referer…) : on les ignore.
            try {
              xhr.setRequestHeader(name, value);
            } catch {}
          }
        },
      });
      hls.on(Events.ERROR, (_event, data) => {
        if (data.fatal) fail(data.details);
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else {
      fail('hls-unsupported');
    }

    return () => {
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('error', onError);
      hls?.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [streamUrl, headers, id]);

  // Déclaré après le chargement du flux : s'exécute aussi à chaque nouveau flux.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (paused) video.pause();
    else play(video);
  }, [paused, streamUrl]);

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <video ref={videoRef} controls={controls} playsInline style={videoStyle} />
    </View>
  );
}

/** Le navigateur peut bloquer la lecture automatique avec le son : on retente en muet. */
function play(video: HTMLVideoElement) {
  video.play().catch((e: unknown) => {
    if (e instanceof DOMException && e.name === 'NotAllowedError') {
      video.muted = true;
      video.play().catch(() => {});
    }
  });
}

const videoStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  backgroundColor: '#000',
} as const;
