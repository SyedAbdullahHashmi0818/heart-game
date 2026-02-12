// Sound utility functions
const playSound = (filename, volume = 0.7) => {
  try {
    const audio = new Audio(`/audio/${filename}`);
    audio.volume = volume;
    audio.play().catch((error) => {
      console.log(`Sound play blocked: ${filename}`, error);
    });
  } catch (error) {
    console.error(`Error playing sound ${filename}:`, error);
  }
};

export const playButtonSound = () => playSound('button.mpeg', 0.6);
export const playCollectSound = () => playSound('collect.mpeg', 0.5);
export const playVoiceSound = () => playSound('voice.mpeg', 0.8);
