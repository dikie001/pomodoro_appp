import { useRef, useMemo } from "react";

const useSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRefs = useRef<Record<string, AudioBuffer | null>>({});
  const sourceRefs = useRef<Record<string, AudioBufferSourceNode | null>>({});

  const soundMap = useMemo(
    () => ({
      start: { src: "/sounds/start.mp3", loop: false },
      tone1: { src: "/sounds/tone1.mp3", loop: true },
      tone2: { src: "/sounds/tone2.mp3", loop: true },
      tone3: { src: "/sounds/tone3.mp3", loop: true },
      tone4: { src: "/sounds/tone4.mp3", loop: true },
      tone5: { src: "/sounds/tone5.mp3", loop: true },
    }),
    []
  );

  // lazily create AudioContext
  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const loadBuffer = async (key: keyof typeof soundMap) => {
    if (bufferRefs.current[key]) return bufferRefs.current[key];
    const ctx = getCtx();
    const res = await fetch(soundMap[key].src);
    const arrBuf = await res.arrayBuffer();
    const decoded = await ctx.decodeAudioData(arrBuf);
    bufferRefs.current[key] = decoded;
    return decoded;
  };

  const playSound = async (key: keyof typeof soundMap) => {
    const ctx = getCtx();
    const buffer = await loadBuffer(key);

    // stop old source if looping
    if (sourceRefs.current[key]) {
      try {
        sourceRefs.current[key]?.stop();
      } catch {}
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = soundMap[key].loop;
    source.connect(ctx.destination);
    source.start(0);

    sourceRefs.current[key] = source;
  };

  const pauseSound = () => {
    Object.values(sourceRefs.current).forEach((src) => {
      try {
        src?.stop();
      } catch {}
    });
    sourceRefs.current = {};
  };

  const isPlaying = () => {
    return Object.values(sourceRefs.current).some((src) => !!src);
  };

  return {
    playStart: () => playSound("start"),
    playTone1: () => playSound("tone1"),
    playTone2: () => playSound("tone2"),
    playTone3: () => playSound("tone3"),
    playTone4: () => playSound("tone4"),
    playTone5: () => playSound("tone5"),
    pauseSound,
    isPlaying,
  };
};

export default useSound;
