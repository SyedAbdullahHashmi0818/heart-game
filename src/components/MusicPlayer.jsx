import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MAIN_MUSIC = "audio/music.mpeg";
const SCREEN5_MUSIC = "audio/nothing else matters.mpeg";
const VOLUME = 0.3;

export default function MusicPlayer() {
  const location = useLocation();
  const mainAudioRef = useRef(null);
  const screen5AudioRef = useRef(null);
  const hasStartedRef = useRef(false);

  const isScreen5 = location.pathname === "/5";

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const mainAudio = new Audio(`${base}${MAIN_MUSIC}`);
    mainAudio.loop = true;
    mainAudio.volume = VOLUME;
    mainAudioRef.current = mainAudio;

    const screen5Audio = new Audio(`${base}${encodeURI(SCREEN5_MUSIC)}`);
    screen5Audio.loop = true;
    screen5Audio.volume = VOLUME;
    screen5AudioRef.current = screen5Audio;

    const tryPlay = (audio) => {
      if (!audio) return;
      audio
        .play()
        .then(() => {
          hasStartedRef.current = true;
        })
        .catch((err) => {
          console.log("Music autoplay blocked:", err);
        });
    };

    const handleInteraction = () => {
      hasStartedRef.current = true;
      if (isScreen5 && screen5AudioRef.current) {
        mainAudioRef.current?.pause();
        tryPlay(screen5AudioRef.current);
      } else if (mainAudioRef.current) {
        screen5AudioRef.current?.pause();
        tryPlay(mainAudioRef.current);
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      mainAudioRef.current?.pause();
      mainAudioRef.current = null;
      screen5AudioRef.current?.pause();
      screen5AudioRef.current = null;
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // Switch track when entering or leaving Screen 5 — play Nothing Else Matters on Screen 5
  useEffect(() => {
    if (!mainAudioRef.current || !screen5AudioRef.current) return;

    if (isScreen5) {
      mainAudioRef.current.pause();
      mainAudioRef.current.currentTime = 0;
      // User already interacted (clicked to reach Screen 5), so play() should be allowed
      hasStartedRef.current = true;
      screen5AudioRef.current.play().catch((err) => {
        console.log("Screen 5 music play failed:", err);
      });
    } else {
      screen5AudioRef.current.pause();
      screen5AudioRef.current.currentTime = 0;
      if (hasStartedRef.current) {
        mainAudioRef.current.play().catch(() => {});
      }
    }
  }, [isScreen5]);

  return null;
}
