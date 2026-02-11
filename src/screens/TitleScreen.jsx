import { useEffect, useState } from "react";
import styles from "./TitleScreen.module.css";

const asset = (name) => `/screen1/${encodeURIComponent(name)}`;

export default function TitleScreen() {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimating(true));
    });
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className={`${styles.screen} ${animating ? styles.animate : ""}`}>
      <div className={styles.bg} />
      <div className={styles.clouds} />
      <div className={styles.dragons} />
      <div className={styles.centerColumn}>
        <div className={styles.centerHeart}>
          <img src={asset("center heart.png")} alt="" aria-hidden />
        </div>
        <div className={styles.banner}>
          <div className={styles.bannerBg}>
            <img src={asset("text box.png")} alt="" aria-hidden />
          </div>
          <div className={styles.bannerContent}>
            <img
              src={asset("for sinnan.png")}
              alt="For Sinnan"
              className={styles.forSinnan}
            />
            <img
              src={asset("small heart.png")}
              alt=""
              aria-hidden
              className={styles.smallHeart}
            />
            <img
              src={asset("for amina.png")}
              alt="From Aamina"
              className={styles.forAmina}
            />
          </div>
        </div>
        <button type="button" className={styles.startButton} aria-label="Start">
          <img src={asset("start button.png")} alt="Start" />
        </button>
      </div>
    </div>
  );
}
