import { useRef, useEffect, useMemo } from "react";
import beep from "/sounds/sound1.mp3";
import complete from "/sounds/sound2.mp3";

const useSound = () => {
  const soundMap = useMemo(
    () => ({
      complete: { src: complete, volume: 1, loop: true },
      beep: { src: beep, volume: 1, loop: true }, // 👈 beep loops forever
    }),
    []
  );

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    Object.entries(soundMap).forEach(([key, { src, volume, loop }]) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = volume;
      audio.loop = loop; // 👈 enable loop here
      audio.load();
      audioRefs.current[key] = audio;
    });
  }, [soundMap]);

  const playSound = (key: keyof typeof soundMap) => {
    const audio = audioRefs.current[key];
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } catch (err) {
        console.warn(`Hey, error playing ${key}:`, err);
      }
    }
  };

  const stopSound = (key: keyof typeof soundMap) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return {
    playComplete: () => playSound("complete"),
    playBeep: () => playSound("beep"),
    stopComplete: () => stopSound("complete"),
    stopBeep: () => stopSound("beep"),
  };
};

export default useSound;
