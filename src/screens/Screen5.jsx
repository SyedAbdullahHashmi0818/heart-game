import { useEffect, useState } from "react";
import styles from "./Screen5.module.css";
import Loader from "../components/Loader";
import { preloadAllAssets } from "../utils/imagePreloader";

const asset = (name) =>
  `${import.meta.env.BASE_URL}screen5/${encodeURIComponent(name)}`;
// Side figures may be in "screen 5" folder (with space) – try that path too
const assetScreen5Folder = (name) =>
  `${import.meta.env.BASE_URL}screen%205/${encodeURIComponent(name)}`;

const STEP_MS = 1300; // delay between each layer appearing

export default function Screen5() {
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState({
    bannerAndBorder: false,
    centerPeople: false,
    centerHeartAndFlowers: false,
    birdBadges: false,
    birdProfiles: false,
    textAndSeal: false,
  });

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
          asset("rabbit left.png"),
          asset("crow right.png"),
          asset("crow rigth.png"),
          assetScreen5Folder("rabbit left.png"),
          assetScreen5Folder("crow right.png"),
          assetScreen5Folder("crow rigth.png"),
          asset("bird bagde.png"),
          asset("text.png"),
          asset("seal.png"),
        ],
      });
      setIsLoading(false);
    };
    loadAssets();
  }, []);

  // Reveal layers one by one: banner → people → heart+flowers → badges → profiles → text+seal
  useEffect(() => {
    if (isLoading) return;
    const t1 = setTimeout(() => setVisible((v) => ({ ...v, bannerAndBorder: true })), 0);
    const t2 = setTimeout(() => setVisible((v) => ({ ...v, centerPeople: true })), STEP_MS * 1);
    const t3 = setTimeout(() => setVisible((v) => ({ ...v, centerHeartAndFlowers: true })), STEP_MS * 2);
    const t4 = setTimeout(() => setVisible((v) => ({ ...v, birdBadges: true })), STEP_MS * 3);
    const t5 = setTimeout(() => setVisible((v) => ({ ...v, birdProfiles: true })), STEP_MS * 4);
    const t6 = setTimeout(() => setVisible((v) => ({ ...v, textAndSeal: true })), STEP_MS * 5);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [isLoading]);

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
        <img src={asset("sc5 border.png")} alt="" className={`${styles.border} ${visible.bannerAndBorder ? styles.visible : ""}`} />
        <img src={asset("sc 5 banner.png")} alt="" className={`${styles.banner} ${visible.bannerAndBorder ? styles.visible : ""}`} />
      </div>

      {/* 3. center people, center heart, flower left, flower right */}
      <div className={styles.centerGroup} aria-hidden>
        <img src={asset("center people.png")} alt="" className={`${styles.centerPeople} ${visible.centerPeople ? styles.visible : ""}`} />
        <img src={asset("center heart.png")} alt="" className={`${styles.centerHeart} ${visible.centerHeartAndFlowers ? styles.visible : ""}`} />
        <img src={asset("flower left.png")} alt="" className={`${styles.flowerLeft} ${visible.centerHeartAndFlowers ? styles.visible : ""}`} />
        <img src={asset("flower right.png")} alt="" className={`${styles.flowerRight} ${visible.centerHeartAndFlowers ? styles.visible : ""}`} />
      </div>

      {/* 4. bird badges */}
      <div className={`${styles.birdBadges} ${visible.birdBadges ? styles.visible : ""}`} aria-hidden>
        <img src={asset("bird bagde.png")} alt="" />
      </div>

      {/* 5. rabbit left + bird/crow right (in place of bird profiles) */}
      <div className={`${styles.sideFigures} ${visible.birdProfiles ? styles.visible : ""}`} aria-hidden>
        <img
          src={asset("rabbit left.png")}
          alt=""
          className={styles.rabbitLeft}
          onError={(e) => {
            if (e.target.dataset.tried !== "1") {
              e.target.dataset.tried = "1";
              e.target.src = assetScreen5Folder("rabbit left.png");
            }
          }}
        />
        <img
          src={asset("crow rigth.png")}
          alt=""
          className={styles.crowRight}
          onError={(e) => {
            if (e.target.dataset.tried !== "1") {
              e.target.dataset.tried = "1";
              e.target.src = asset("crow right.png");
            } else if (e.target.dataset.tried2 !== "1") {
              e.target.dataset.tried2 = "1";
              e.target.src = assetScreen5Folder("crow rigth.png");
            }
          }}
        />
      </div>

      {/* 6. text and seal */}
      <div className={styles.textAndSeal} aria-hidden>
        <img src={asset("text.png")} alt="Nothing Else Matters" className={`${styles.text} ${visible.textAndSeal ? styles.visible : ""}`} />
        <img src={asset("seal.png")} alt="" className={`${styles.seal} ${visible.textAndSeal ? styles.visible : ""}`} />
      </div>
    </div>
  );
}
