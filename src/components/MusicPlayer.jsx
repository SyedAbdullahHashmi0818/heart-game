import { useEffect, useRef } from 'react';

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio('/audio/music.mpeg');
    audio.loop = true;
    audio.volume = 0.8; // 80% volume
    audioRef.current = audio;

    // Try to start playing music
    const tryPlay = () => {
      if (!hasStartedRef.current && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            hasStartedRef.current = true;
          })
          .catch((error) => {
            // Autoplay may be blocked by browser
            console.log('Music autoplay blocked, will start on user interaction:', error);
          });
      }
    };

    // Try to play when audio is ready
    audio.addEventListener('loadeddata', () => {
      tryPlay();
    });

    // Also try immediately
    tryPlay();

    // Try when canplaythrough
    audio.addEventListener('canplaythrough', () => {
      tryPlay();
    });

    // Also try on first user interaction (fallback if autoplay blocked)
    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return null; // No visual component
}
