import { useEffect, useRef, useState } from "react";
import styles from "./Screen4.module.css";
import {
  playButtonSound,
  playVoiceSound,
  stopVoiceSound,
} from "../utils/sounds";
import Loader from "../components/Loader";
import { preloadAllAssets } from "../utils/imagePreloader";

const assetScreen2 = (name) =>
  `${import.meta.env.BASE_URL}screen2/${encodeURIComponent(name)}`;
const assetScreen4 = (name) =>
  `${import.meta.env.BASE_URL}screen4/${encodeURIComponent(name)}`;

const LINE1 = "Congratulations on finishing the trials";
const LINE2 = "truly a master of collecting bouquets and hearts in a basket";
const LINE3 = "now reclaim your reward";
const TYPING_MS_PER_CHAR = 70;
const PAUSE_BEFORE_NEXT_MS = 1800;

export default function Screen4({ onProceed }) {
  const [animating, setAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [birdMouthOpen, setBirdMouthOpen] = useState(false);
  const [phase, setPhase] = useState("idle"); // 'idle' | 'line1' | 'line2' | 'line3' | 'reward'
  const [visibleLength, setVisibleLength] = useState(0);
  const [showSun, setShowSun] = useState(false);
  const [showRabbits, setShowRabbits] = useState(false);
  const [showRewardButton, setShowRewardButton] = useState(false);
  const mouthIntervalRef = useRef(null);

  // Preload all assets
  useEffect(() => {
    let animationFrameId = null;

    const loadAssets = async () => {
      await preloadAllAssets({
        images: [
          assetScreen2("sc2 clouds.png"),
          assetScreen2("sc2 bird bg.png"),
          assetScreen2("sc2 bird open.png"),
          assetScreen2("sc2 bird close.png"),
          assetScreen2("text banner.png"),
          assetScreen4("sun.png"),
          assetScreen4("rabbit left.png"),
          assetScreen4("rabbit right.png"),
          assetScreen4("reward.png"),
        ],
        backgrounds: [`${import.meta.env.BASE_URL}screen3/sc%203%20bg.png`],
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
      setVisibleLength(0);
    }, 2800);
    return () => clearTimeout(start);
  }, [phase]);

  const lines = { line1: LINE1, line2: LINE2, line3: LINE3 };
  const currentText =
    phase === "line1" || phase === "line2" || phase === "line3"
      ? lines[phase]
      : "";

  // Type current line letter by letter, then advance or show reward
  useEffect(() => {
    if (phase !== "line1" && phase !== "line2" && phase !== "line3") return;
    const text = currentText;
    if (visibleLength >= text.length) {
      if (phase === "line1") {
        const next = setTimeout(() => {
          setPhase("line2");
          setVisibleLength(0);
        }, PAUSE_BEFORE_NEXT_MS);
        return () => clearTimeout(next);
      }
      if (phase === "line2") {
        const next = setTimeout(() => {
          setPhase("line3");
          setVisibleLength(0);
        }, PAUSE_BEFORE_NEXT_MS);
        return () => clearTimeout(next);
      }
      if (phase === "line3") {
        const next = setTimeout(() => {
          setPhase("reward");
          setShowSun(true);
          // Show rabbits after sun appears
          setTimeout(() => {
            setShowRabbits(true);
            // Show reward button after rabbits reach banner (animation duration is ~3.5s)
            setTimeout(() => {
              setShowRewardButton(true);
            }, 3500);
          }, 600);
        }, PAUSE_BEFORE_NEXT_MS);
        return () => clearTimeout(next);
      }
      return;
    }
    const tick = setTimeout(
      () => setVisibleLength((n) => n + 1),
      TYPING_MS_PER_CHAR,
    );
    return () => clearTimeout(tick);
  }, [phase, visibleLength, currentText]);

  // Bird mouth animation while typing
  useEffect(() => {
    if (phase !== "line1" && phase !== "line2" && phase !== "line3") {
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
      setBirdMouthOpen(false);
      return;
    }
    // Play voice sound when bird starts talking
    playVoiceSound();
    mouthIntervalRef.current = setInterval(
      () => setBirdMouthOpen((prev) => !prev),
      120,
    );
    return () => {
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
    };
  }, [phase]);

  useEffect(() => {
    const len = currentText.length;
    if (
      (phase === "line1" || phase === "line2" || phase === "line3") &&
      visibleLength >= len
    ) {
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
      setBirdMouthOpen(false);
      stopVoiceSound();
    }
  }, [phase, visibleLength, currentText]);

  const displayText = currentText.slice(0, visibleLength);
  const isTyping = phase === "line1" || phase === "line2" || phase === "line3";
  const showCursor = isTyping && visibleLength < currentText.length;
  const showBannerText = isTyping || phase === "reward";
  const bannerContent = phase === "reward" ? LINE3 : displayText;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`${styles.screen} ${animating ? styles.animate : ""}`}>
      <div className={styles.bg} />
      <div className={styles.clouds}>
        <img src={assetScreen2("sc2 clouds.png")} alt="" aria-hidden />
      </div>
      <div className={styles.birdBg}>
        <img src={assetScreen2("sc2 bird bg.png")} alt="" aria-hidden />
      </div>
      <div className={styles.birdClose}>
        <img
          src={assetScreen2(
            birdMouthOpen ? "sc2 bird open.png" : "sc2 bird close.png",
          )}
          alt=""
          aria-hidden
        />
      </div>
      <div className={styles.textBanner}>
        <img src={assetScreen2("text banner.png")} alt="" aria-hidden />
        <div className={styles.bannerText}>
          {showBannerText && (
            <p className={styles.bannerLine}>
              {bannerContent}
              {showCursor && (
                <span className={styles.cursor} aria-hidden>
                  |
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {showSun && (
        <div className={styles.sun}>
          <img src={assetScreen4("sun.png")} alt="" aria-hidden />
        </div>
      )}
      {showRabbits && (
        <>
          <div className={styles.rabbitLeft}>
            <img src={assetScreen4("rabbit left.png")} alt="" aria-hidden />
          </div>
          <div className={styles.rabbitRight}>
            <img src={assetScreen4("rabbit right.png")} alt="" aria-hidden />
          </div>
        </>
      )}
      {showRewardButton && (
        <button
          type="button"
          className={styles.rewardButton}
          aria-label="Reclaim your reward"
          onClick={() => {
            playButtonSound();
            onProceed?.();
          }}
        >
          <img src={assetScreen4("reward.png")} alt="Reclaim your reward" />
        </button>
      )}
    </div>
  );
}
