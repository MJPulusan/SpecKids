import { useEffect, useRef } from 'react';

type AudioPlayerProps = {
  src: string;
  isMuted?: boolean;
  repeat?: boolean;
};

export function AudioPlayer({ src, isMuted = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = isMuted;
      if (!audio.paused) return;
      audio.play().catch(console.error);
    }
  }, [isMuted]);

  return <audio ref={audioRef} src={src} autoPlay />;
}
