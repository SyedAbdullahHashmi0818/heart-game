import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Screen3.module.css";

const asset = (name) => `/screen3/${encodeURIComponent(name)}`;

const BASKET_MIN_X = 15;
const BASKET_MAX_X = 85;
const BASKET_STEP = 3;
const BASKET_LERP = 0.09; // smooth follow toward target (0–1, lower = smoother/slower)

const FALL_SPEED = 0.6; // % per frame (faster = harder)
const SPAWN_INTERVAL_MS = 2200;
const SPAWN_X_MIN = 8;
const SPAWN_X_MAX = 92;
const SPAWN_Y_MIN = 12;
const SPAWN_Y_MAX = 18;
const BASKET_CATCH_LEFT = -10;
const BASKET_CATCH_RIGHT = 10;
const BASKET_CATCH_TOP = 76;
const BASKET_CATCH_BOTTOM = 90;

let nextId = 0;
function spawnItem() {
  const type = Math.random() < 0.5 ? "heart" : "flower";
  const x = SPAWN_X_MIN + Math.random() * (SPAWN_X_MAX - SPAWN_X_MIN);
  const y = SPAWN_Y_MIN + Math.random() * (SPAWN_Y_MAX - SPAWN_Y_MIN);
  return { id: ++nextId, type, x, y };
}

export default function Screen3() {
  const [basketX, setBasketX] = useState(50);
  const [targetBasketX, setTargetBasketX] = useState(50);
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [falling, setFalling] = useState([]);
  const [heartsPlaced, setHeartsPlaced] = useState(0);
  const [flowersPlaced, setFlowersPlaced] = useState(0);
  const rafRef = useRef(null);
  const basketXRef = useRef(50);
  const targetBasketXRef = useRef(50);
  const lastSpawnRef = useRef(0);
  const fallingRef = useRef([]);

  basketXRef.current = basketX;
  targetBasketXRef.current = targetBasketX;
  fallingRef.current = falling;

  const moveLeft = useCallback(() => {
    setTargetBasketX((x) => Math.max(BASKET_MIN_X, x - BASKET_STEP));
  }, []);

  const moveRight = useCallback(() => {
    setTargetBasketX((x) => Math.min(BASKET_MAX_X, x + BASKET_STEP));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setLeftPressed(true);
        moveLeft();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setRightPressed(true);
        moveRight();
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft") setLeftPressed(false);
      if (e.key === "ArrowRight") setRightPressed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [moveLeft, moveRight]);

  useEffect(() => {
    if (!leftPressed && !rightPressed) return;
    const id = setInterval(() => {
      if (leftPressed) moveLeft();
      if (rightPressed) moveRight();
    }, 80);
    return () => clearInterval(id);
  }, [leftPressed, rightPressed, moveLeft, moveRight]);

  // Spawn droppable items from the log
  useEffect(() => {
    const t = setTimeout(() => setFalling((prev) => [...prev, spawnItem()]), 600);
    lastSpawnRef.current = performance.now();
    const tick = () => {
      const now = performance.now();
      if (now - lastSpawnRef.current >= SPAWN_INTERVAL_MS) {
        lastSpawnRef.current = now;
        setFalling((prev) => [...prev, spawnItem()]);
      }
    };
    const id = setInterval(tick, 400);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  // Game loop: smooth basket movement, fall and collision
  useEffect(() => {
    const loop = () => {
      const target = targetBasketXRef.current;
      const current = basketXRef.current;
      const smoothed = current + (target - current) * BASKET_LERP;
      const newBasketX = Math.round(smoothed * 100) / 100;
      basketXRef.current = newBasketX;
      setBasketX(newBasketX);

      const bx = newBasketX;
      const prev = fallingRef.current;
      const next = [];
      let caughtHearts = 0;
      let caughtFlowers = 0;
      let missedHearts = 0;
      let missedFlowers = 0;
      for (const item of prev) {
        const newY = item.y + FALL_SPEED;
        if (newY > 95) {
          if (item.type === "heart") missedHearts++;
          else missedFlowers++;
          continue;
        }
        const inBasketX = item.x >= bx + BASKET_CATCH_LEFT && item.x <= bx + BASKET_CATCH_RIGHT;
        const inBasketY = newY >= BASKET_CATCH_TOP && newY <= BASKET_CATCH_BOTTOM;
        if (inBasketX && inBasketY) {
          if (item.type === "heart") caughtHearts++;
          else caughtFlowers++;
          continue;
        }
        next.push({ ...item, y: newY });
      }
      fallingRef.current = next;
      setFalling(next);
      if (caughtHearts > 0) setHeartsPlaced((p) => Math.min(6, p + caughtHearts));
      if (caughtFlowers > 0) setFlowersPlaced((p) => Math.min(2, p + caughtFlowers));
      if (missedHearts > 0) setHeartsPlaced((p) => Math.max(0, p - missedHearts));
      if (missedFlowers > 0) setFlowersPlaced((p) => Math.max(0, p - missedFlowers));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={styles.screen}>
      <div className={styles.bg} />
      {/* Left top: 6 heart placeholders, filled when hearts caught */}
      <div className={styles.heartsWrap}>
        {[...Array(6)].map((_, i) => (
          <img
            key={i}
            src={asset(i < heartsPlaced ? "heart.png" : "heart place holder.png")}
            alt=""
            aria-hidden
            className={styles.heartPlaceholder}
          />
        ))}
      </div>
      {/* Right top: 2 flower placeholders, filled when flowers caught */}
      <div className={styles.flowersWrap}>
        {[...Array(2)].map((_, i) => (
          <img
            key={i}
            src={asset(i < flowersPlaced ? "flowers placed.png" : "flowers placeholder.png")}
            alt=""
            aria-hidden
            className={styles.flowerPlaceholder}
          />
        ))}
      </div>
      {/* Top center: log */}
      <div className={styles.logWrap}>
        <img src={asset("sc2 border twig.png")} alt="" aria-hidden className={styles.logImg} />
      </div>
      {/* Falling items from the log */}
      {falling.map((item) => (
        <div
          key={item.id}
          className={`${styles.fallingItem} ${item.type === "flower" ? styles.fallingItemFlower : ""}`}
          style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translate(-50%, 0)" }}
        >
          <img
            src={asset(item.type === "heart" ? "heart.png" : "droppable flowers.png")}
            alt=""
            aria-hidden
          />
        </div>
      ))}
      {/* Basket at bottom, movable by position */}
      <div
        className={styles.basketWrap}
        style={{ left: `${basketX}%`, transform: "translateX(-50%)" }}
      >
        <img src={asset("basket.png")} alt="" aria-hidden className={styles.basketImg} />
      </div>
      {/* Left arrow key - bottom left, expands when pressed */}
      <button
        type="button"
        className={`${styles.arrowKey} ${styles.arrowLeft} ${leftPressed ? styles.arrowPressed : ""}`}
        aria-label="Move basket left"
        onMouseDown={() => { setLeftPressed(true); moveLeft(); }}
        onMouseUp={() => setLeftPressed(false)}
        onMouseLeave={() => setLeftPressed(false)}
        onTouchStart={(e) => { e.preventDefault(); setLeftPressed(true); moveLeft(); }}
        onTouchEnd={() => setLeftPressed(false)}
      >
        <img src={asset("left arrow key.png")} alt="" aria-hidden />
      </button>
      {/* Right arrow key - bottom right, expands when pressed */}
      <button
        type="button"
        className={`${styles.arrowKey} ${styles.arrowRight} ${rightPressed ? styles.arrowPressed : ""}`}
        aria-label="Move basket right"
        onMouseDown={() => { setRightPressed(true); moveRight(); }}
        onMouseUp={() => setRightPressed(false)}
        onMouseLeave={() => setRightPressed(false)}
        onTouchStart={(e) => { e.preventDefault(); setRightPressed(true); moveRight(); }}
        onTouchEnd={() => setRightPressed(false)}
      >
        <img src={asset("right arrow key.png")} alt="" aria-hidden />
      </button>
    </div>
  );
}
