import { useRef, useEffect, useMemo } from "react";

const useSound = () => {
  const soundMap = useMemo(
    () => ({
      start: { src: "/sounds/start.mp3", volume: 1, loop: false },
      tone1: { src: "/sounds/tone1.mp3", volume: 1, loop: true },
      tone2: { src: "/sounds/tone2.mp3", volume: 1, loop: true },
      tone3: { src: "/sounds/tone3.mp3", volume: 1, loop: true },
      tone4: { src: "/sounds/tone4.mp3", volume: 1, loop: true },
      tone5: { src: "/sounds/tone5.mp3", volume: 1, loop: true },
    }),
    []
  );

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    Object.entries(soundMap).forEach(([key, { src, volume, loop }]) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = volume;
      audio.loop = loop;
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
        console.warn(`Error playing ${key}:`, err);
      }
    }
  };

  //pause thesounds
  const pauseSound = () => {
    Object.values(audioRefs.current).forEach((audio) => audio.pause());
  };

  //check if sound is playing
  const isPlaying = () => {
    if (
      Object.values(audioRefs.current).some(
        (audio) => audio.currentTime > 0 || !audio.paused || !audio.ended
      )
    ) {
      return true;
    } else return false;
  };

  return {
    playTone1: () => playSound("tone1"),
    playTone2: () => playSound("tone2"),
    playTone3: () => playSound("tone3"),
    playTone4: () => playSound("tone4"),
    playTone5: () => playSound("tone5"),
    playStart: () => playSound("start"),
    pauseSound,
    isPlaying,
  };
};

export default useSound;
