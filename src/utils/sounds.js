// Sound utility functions
const playSound = (filename, volume = 0.7) => {
  try {
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/${filename}`);
    audio.volume = volume;
    audio.play().catch((error) => {
      console.log(`Sound play blocked: ${filename}`, error);
    });
  } catch (error) {
    console.error(`Error playing sound ${filename}:`, error);
  }
};

let voiceAudio = null;

export const playButtonSound = () => playSound("button.mpeg", 0.8);
export const playCollectSound = () => playSound("collect.mpeg", 0.7);
export const playVoiceSound = () => {
  if (voiceAudio) {
    voiceAudio.pause();
    voiceAudio = null;
  }
  try {
    voiceAudio = new Audio(`${import.meta.env.BASE_URL}audio/voice.mpeg`);
    voiceAudio.volume = 0.9;
    voiceAudio.play().catch((error) => {
      console.log("Sound play blocked: voice.mpeg", error);
    });
  } catch (error) {
    console.error("Error playing voice:", error);
  }
};
export const stopVoiceSound = () => {
  if (voiceAudio) {
    voiceAudio.pause();
    voiceAudio.currentTime = 0;
    voiceAudio = null;
  }
};
