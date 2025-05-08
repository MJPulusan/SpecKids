import { createContext, useContext, useEffect, useRef, useState } from 'react';

// background-music
const MusicContext = createContext<{
  hasInteracted: boolean;
  setHasInteracted: (val: boolean) => void;
}>({
  hasInteracted: false,
  setHasInteracted: () => {},
});

export function useMusic() {
  return useContext(MusicContext);
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (hasInteracted && audioRef.current) {
      audioRef.current.play().catch(console.warn);
    }
  }, [hasInteracted]); // when a button is clicked (sign in | sign up)

  return (
    <MusicContext.Provider value={{ hasInteracted, setHasInteracted }}>
      {children}
      <audio
        ref={audioRef}
        src="/sounds/background-music.mp3"
        loop
        autoPlay
        muted={!hasInteracted}
      />
    </MusicContext.Provider>
  );
}
