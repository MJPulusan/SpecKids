import Sketch from '../components/SketchPad';
import { AudioPlayer } from '../components/AudioPlayer';
import { useEffect } from 'react';
import '../App.css';

export function SketchPage() {
  useEffect(() => {
    const audio = document.querySelector('audio');
    audio?.pause();

    return () => {
      audio?.play().catch(console.warn); // resume when leaving
    };
  }, []);

  return (
    <>
      <h1>Sketch Pad</h1>
      <div className="form-container">
        <div className="no-touch-scroll">
          <Sketch />
        </div>
        <AudioPlayer src="/sounds/CalmMusic01.mp3" />
      </div>
    </>
  );
}
