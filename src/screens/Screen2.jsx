import { useEffect, useState } from "react";
import styles from "./Screen2.module.css";

const asset = (name) => `/screen2/${encodeURIComponent(name)}`;

const LINE1 = "Greetings Traveller!";
const LINE2 = "I bring forth a challenge of great adversary!";
const TYPING_MS_PER_CHAR = 80;

export default function Screen2() {
  const [animating, setAnimating] = useState(false);
  const [phase, setPhase] = useState("idle"); // 'idle' | 'line1' | 'line2'
  const [visibleLength, setVisibleLength] = useState(0);
  const [currentLine, setCurrentLine] = useState(LINE1);

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimating(true));
    });
    return () => cancelAnimationFrame(t);
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
    if (phase !== "line1" && phase !== "line2") return;
    const text = phase === "line1" ? LINE1 : LINE2;
    if (visibleLength >= text.length) {
      if (phase === "line1") {
        const switchToSecond = setTimeout(() => {
          setPhase("line2");
          setCurrentLine(LINE2);
          setVisibleLength(0);
        }, 1500);
        return () => clearTimeout(switchToSecond);
      }
      return;
    }
    const tick = setTimeout(() => {
      setVisibleLength((n) => n + 1);
    }, TYPING_MS_PER_CHAR);
    return () => clearTimeout(tick);
  }, [phase, visibleLength]);

  const displayText = currentLine.slice(0, visibleLength);

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
        <img src={asset("sc2 bird close.png")} alt="" aria-hidden />
      </div>
      <div className={styles.textBanner}>
        <img src={asset("text banner.png")} alt="" aria-hidden />
        <div className={styles.bannerText}>
          {(phase === "line1" || phase === "line2") && (
            <p
              className={
                phase === "line1" ? styles.bannerLine1 : styles.bannerLine2
              }
            >
              {displayText}
              {(phase === "line1"
                ? visibleLength < LINE1.length
                : visibleLength < LINE2.length) && (
                <span className={styles.cursor} aria-hidden>
                  |
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        className={styles.proceedButton}
        aria-label="Proceed"
      >
        <img src={asset("proceed button.png")} alt="Proceed" />
      </button>
    </div>
  );
}
