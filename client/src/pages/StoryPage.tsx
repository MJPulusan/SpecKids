import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const storyPages = [
  // 'Once upon a time, in a land full of colors, lived a happy blue bunny named Benny.',
  // 'Benny loved to bounce through the rainbow fields and nibble on crunchy carrots.',
  // 'One day, Benny met a shy turtle named Tilly who needed help crossing the stream.',
  // 'Together, they built a leafy bridge and became best friends forever!',
  'I love the mountains, I love the rolling hills',
  'I love the flowers, I love the daffodils!',
  'I love the fireside, When all the lights are low',
  'Boom-dee-yaa-da, Boom-dee-yaa-da, Boom-dee-yaa-da, Boom-dee-yaa-da...',
];

export function StoryBook() {
  const [page, setPage] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const navigate = useNavigate();

  // Load voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => setVoices(synth.getVoices());

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, []);

  // Speak text using Microsoft Ana if available
  function speak(text: string) {
    speechSynthesis.cancel(); // Stop any previous speech
    const anaVoice = voices.find(
      (v) =>
        v.name === 'Microsoft Ana Online (Natural)' ||
        (v.name.includes('Ana') && v.name.includes('Microsoft'))
    );

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = anaVoice || voices[0];
    utter.rate = 0.9;
    speechSynthesis.speak(utter);
  }

  // Autoplay first page after voices load
  useEffect(() => {
    if (voices.length > 0) {
      speak(storyPages[page]);
    }
  }, [voices]);

  // Handle Next with auto-read
  function handleNext() {
    setPage((prev) => {
      const nextPage = prev + 1;
      speak(storyPages[nextPage]);
      return nextPage;
    });
  }

  // Handle Back with auto-read
  function handleBack() {
    setPage((prev) => {
      const prevPage = prev - 1;
      speak(storyPages[prevPage]);
      return prevPage;
    });
  }

  return (
    <div>
      <div>
        <h1>📖 Benny's Adventure</h1>
        <div className="story-book-container">
          <button
            onClick={() => {
              speechSynthesis.cancel(); // Stop speech on close
              navigate('/kids/kids-main');
            }}>
            <img src="/images/close.png" alt="Close" className="closeIcon" />
          </button>
          <h1 className="story-book">{storyPages[page]}</h1>

          <div className="button-group">
            <button disabled={page === 0} onClick={handleBack}>
              ⬅️ Back
            </button>

            <button
              disabled={page === storyPages.length - 1}
              onClick={handleNext}>
              Next ➡️
            </button>
          </div>

          {voices.length > 0 && !voices.some((v) => v.name.includes('Ana')) && (
            <p>
              Microsoft Ana Online (Natural) voice not found. Using fallback
              voice.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
