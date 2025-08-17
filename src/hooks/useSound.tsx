import { useRef, useEffect, useMemo } from "react";
import beep from "/sounds/sound1.mp3";
import complete from "/sounds/sound2.mp3";


const useSound = () => {
  const soundMap = useMemo(
    () => ({
      complete: { src: complete, volume: 1 },
      beep: { src: beep, volume: 1 },
     
    }),
    []
  );

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    Object.entries(soundMap).forEach(([key, { src, volume }]) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = volume;
      audio.load();
      audioRefs.current[key] = audio;
    });
  }, [soundMap]);

  const playSound = (key: keyof typeof soundMap) => {
    const audio = audioRefs.current[key];
    if (audio) {
      try {
        audio.pause(); // stop any current play
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } catch (err) {
        console.warn(`Hey, error playing ${key}:`, err);
      }
    }
  };

  return {
    playComplete: () => playSound("complete"),
    playBeep: () => playSound("beep"),

  };
};

export default useSound;
