import { useEffect, useRef, useState } from "react";
import styles from "./Screen2.module.css";
import { playButtonSound, playVoiceSound } from "../utils/sounds";
import Loader from "../components/Loader";
import { preloadAllAssets } from "../utils/imagePreloader";

const asset = (name) => `/screen2/${encodeURIComponent(name)}`;

const LINE1 = "Greetings Traveller!";
const LINE2 = "I bring forth a challenge of great adversary!";
const LINE3 = "Thou must collect 6 hearts and 2 flowers using thine arrow keys";
const TYPING_MS_PER_CHAR = 80;
const PAUSE_BEFORE_NEXT_MS = 1500;

export default function Screen2({ onProceed }) {
  const [animating, setAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState("idle"); // 'idle' | 'line1' | 'line2' | 'line3'
  const [visibleLength, setVisibleLength] = useState(0);
  const [currentLine, setCurrentLine] = useState(LINE1);
  const [birdMouthOpen, setBirdMouthOpen] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const mouthIntervalRef = useRef(null);

  // Preload all assets
  useEffect(() => {
    let animationFrameId = null;
    
    const loadAssets = async () => {
      await preloadAllAssets({
        images: [
          asset("sc2 clouds.png"),
          asset("sc2 bird bg.png"),
          asset("sc2 bird open.png"),
          asset("sc2 bird close.png"),
          asset("text banner.png"),
          asset("proceed button.png"),
        ],
        backgrounds: [
          "/screen2/sc2 bg.png",
        ],
      });
      setIsLoading(false);
      // Start animation after a brief delay
      animationFrameId = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    };

    loadAssets();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Start typing first line after banner appears (2.8s)
  useEffect(() => {
    if (phase !== "idle") return;
    const start = setTimeout(() => {
      setPhase("line1");
      setCurrentLine(LINE1);
      setVisibleLength(0);
    }, 2800);
    return () => clearTimeout(start);
  }, [phase]);

  // Type current line letter by letter
  useEffect(() => {
    if (phase !== "line1" && phase !== "line2" && phase !== "line3") return;
    const text = phase === "line1" ? LINE1 : phase === "line2" ? LINE2 : LINE3;
    if (visibleLength >= text.length) {
      if (phase === "line1") {
        const switchToSecond = setTimeout(() => {
          setPhase("line2");
          setCurrentLine(LINE2);
          setVisibleLength(0);
        }, PAUSE_BEFORE_NEXT_MS);
        return () => clearTimeout(switchToSecond);
      }
      if (phase === "line2") {
        const switchToThird = setTimeout(() => {
          setPhase("line3");
          setCurrentLine(LINE3);
          setVisibleLength(0);
        }, PAUSE_BEFORE_NEXT_MS);
        return () => clearTimeout(switchToThird);
      }
      if (phase === "line3") {
        // Show proceed button after third line finishes
        setTimeout(() => {
          setShowProceedButton(true);
        }, PAUSE_BEFORE_NEXT_MS);
        return;
      }
      return;
    }
    const tick = setTimeout(() => {
      setVisibleLength((n) => n + 1);
    }, TYPING_MS_PER_CHAR);
    return () => clearTimeout(tick);
  }, [phase, visibleLength]);

  // Start/stop bird mouth alternating when phase changes (don't depend on visibleLength or we clear every letter)
  useEffect(() => {
    if (phase !== "line1" && phase !== "line2" && phase !== "line3") {
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
      setBirdMouthOpen(false);
      return;
    }
    // Play voice sound when bird starts talking
    playVoiceSound();
    mouthIntervalRef.current = setInterval(() => {
      setBirdMouthOpen((prev) => !prev);
    }, 120);
    return () => {
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
    };
  }, [phase]);

  // Stop mouth animation when typing finishes for current line
  useEffect(() => {
    const len = phase === "line1" ? LINE1.length : phase === "line2" ? LINE2.length : phase === "line3" ? LINE3.length : 0;
    if ((phase === "line1" || phase === "line2" || phase === "line3") && visibleLength >= len) {
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
      setBirdMouthOpen(false);
    }
  }, [phase, visibleLength]);

  const displayText = currentLine.slice(0, visibleLength);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`${styles.screen} ${animating ? styles.animate : ""}`}>
      <div className={styles.bg} />
      <div className={styles.clouds}>
        <img src={asset("sc2 clouds.png")} alt="" aria-hidden />
      </div>
      <div className={styles.birdBg}>
        <img src={asset("sc2 bird bg.png")} alt="" aria-hidden />
      </div>
      <div className={styles.birdClose}>
        <img
          src={asset(birdMouthOpen ? "sc2 bird open.png" : "sc2 bird close.png")}
          alt=""
          aria-hidden
        />
      </div>
      <div className={styles.textBanner}>
        <img src={asset("text banner.png")} alt="" aria-hidden />
        <div className={styles.bannerText}>
          {(phase === "line1" || phase === "line2" || phase === "line3") && (
            <p
              className={
                phase === "line1" ? styles.bannerLine1 : phase === "line2" ? styles.bannerLine2 : styles.bannerLine3
              }
            >
              {displayText}
              {(phase === "line1"
                ? visibleLength < LINE1.length
                : phase === "line2"
                ? visibleLength < LINE2.length
                : visibleLength < LINE3.length) && (
                <span className={styles.cursor} aria-hidden>
                  |
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {showProceedButton && (
        <button
          type="button"
          className={styles.proceedButton}
          aria-label="Proceed"
          onClick={() => {
            playButtonSound();
            onProceed();
          }}
        >
          <img src={asset("proceed button.png")} alt="Proceed" />
        </button>
      )}
    </div>
  );
}
