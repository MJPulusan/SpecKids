import { useEffect, useRef, useState } from 'react';

type AudioPlayerProps = {
  src: string;
  isMuted?: boolean;
  repeat?: boolean;
};

export function AudioPlayer({
  src,
  isMuted = false,
  repeat = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    if (canPlay && audioRef.current) {
      const audio = audioRef.current;
      audio.muted = isMuted;
      audio.loop = repeat;
      audio.play().catch(console.warn);
    }
  }, [canPlay, isMuted, repeat]);

  return (
    <div onClick={() => setCanPlay(true)}>
      <audio ref={audioRef} src={src} />
    </div>
  );
}
