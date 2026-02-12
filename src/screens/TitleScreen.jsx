import { useEffect, useState } from "react";
import styles from "./TitleScreen.module.css";
import { playButtonSound } from "../utils/sounds";
import Loader from "../components/Loader";
import { preloadAllAssets } from "../utils/imagePreloader";

const asset = (name) => `/screen1/${encodeURIComponent(name)}`;

export default function TitleScreen({ onStart }) {
  const [animating, setAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Preload all assets
  useEffect(() => {
    let animationFrameId = null;
    
    const loadAssets = async () => {
      await preloadAllAssets({
        images: [
          asset("center heart.png"),
          asset("text box.png"),
          asset("for sinnan.png"),
          asset("small heart.png"),
          asset("for amina.png"),
          asset("start button.png"),
        ],
        backgrounds: [
          "/screen1/bg.png",
          "/screen1/clouds%20b.png",
          "/screen1/dragons.png",
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

  const handleStart = () => {
    playButtonSound();
    onStart();
  };

  if (isLoading) {
    return <Loader />;
  }

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
        <button 
          type="button" 
          className={styles.startButton} 
          aria-label="Start"
          onClick={handleStart}
        >
          <img src={asset("start button.png")} alt="Start" />
        </button>
      </div>
    </div>
  );
}
