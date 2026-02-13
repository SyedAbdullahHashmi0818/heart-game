import { useEffect, useState } from "react";
import styles from "./Screen5.module.css";
import Loader from "../components/Loader";
import { preloadAllAssets } from "../utils/imagePreloader";

const asset = (name) =>
  `${import.meta.env.BASE_URL}screen5/${encodeURIComponent(name)}`;

export default function Screen5() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      await preloadAllAssets({
        images: [
          asset("sc 5 bg.png"),
          asset("sc5 border.png"),
          asset("sc 5 banner.png"),
          asset("center people.png"),
          asset("center heart.png"),
          asset("flower left.png"),
          asset("flower right.png"),
          asset("bird profiles.png"),
          asset("bird bagde.png"),
          asset("text.png"),
          asset("seal.png"),
        ],
      });
      setIsLoading(false);
    };
    loadAssets();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.screen}>
      {/* 1. bg */}
      <div className={styles.bg} aria-hidden>
        <img src={asset("sc 5 bg.png")} alt="" />
      </div>

      {/* 2. border and banner */}
      <div className={styles.borderAndBanner} aria-hidden>
        <img src={asset("sc5 border.png")} alt="" className={styles.border} />
        <img src={asset("sc 5 banner.png")} alt="" className={styles.banner} />
      </div>

      {/* 3. center people, center heart, flower left, flower right */}
      <div className={styles.centerGroup} aria-hidden>
        <img src={asset("center people.png")} alt="" className={styles.centerPeople} />
        <img src={asset("center heart.png")} alt="" className={styles.centerHeart} />
        <img src={asset("flower left.png")} alt="" className={styles.flowerLeft} />
        <img src={asset("flower right.png")} alt="" className={styles.flowerRight} />
      </div>

      {/* 4. bird profiles */}
      <div className={styles.birdProfiles} aria-hidden>
        <img src={asset("bird profiles.png")} alt="" />
      </div>

      {/* 5. bird badges */}
      <div className={styles.birdBadges} aria-hidden>
        <img src={asset("bird bagde.png")} alt="" />
      </div>

      {/* 6. text and seal */}
      <div className={styles.textAndSeal} aria-hidden>
        <img src={asset("text.png")} alt="Nothing Else Matters" className={styles.text} />
        <img src={asset("seal.png")} alt="" className={styles.seal} />
      </div>
    </div>
  );
}
