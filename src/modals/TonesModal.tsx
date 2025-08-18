import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import useSound from "../hooks/useSound";

interface MainProps {
  setShowTones: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
}

const TONE_KEY = "tone";

const TonesModal = ({ setShowTones, setSuccess }: MainProps) => {
  const [tones, setTones] = useState([
    { id: 1, name: "Tone 1", current: false },
    { id: 2, name: "Tone 2", current: true },
    { id: 3, name: "Tone 3", current: false },
    { id: 4, name: "Tone 4", current: false },
    { id: 5, name: "Tone 5", current: false },
  ]);

  const { playTone1, playTone2, playTone3, playTone4, playTone5, pauseSound } =
    useSound();

  useEffect(() => {
    const settings = localStorage.getItem(TONE_KEY);
    const toneId = settings ? Number(settings) : 0;
    if (!toneId) return;

    setTones((prev) =>
      prev.map((tone) => ({ ...tone, current: tone.id === toneId }))
    );
  }, []);

  const handleToneClick = (id: number) => {
    pauseSound();
    const playFunctions = [
      playTone1,
      playTone2,
      playTone3,
      playTone4,
      playTone5,
    ];
    playFunctions[id - 1]?.();

    localStorage.setItem(TONE_KEY, JSON.stringify(id));
    setTones((prev) =>
      prev.map((tone) => ({ ...tone, current: tone.id === id }))
    );
  };

  const handleSetTone = () => {
    setShowTones(false);
    pauseSound();
    setSuccess("tones");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="absolute z-54 top-6 right-0">
      <div className="max-w-sm w-50 rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl p-6  shadow-[0_20px_40px_-4px_rgba(0,0,0,0.3)] animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          onClick={() => setShowTones(false)}
          className="absolute top-2 right-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
          aria-label="Close settings"
        >
          <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </button>

        <div className="text-center mb-5">
          <h1 className="text-lg font-semibold text-white mb-1">
            🎵 Choose Tone
          </h1>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        </div>

        <div className="space-y-2 mb-4">
          {tones.map((tone) => (
            <button
              key={tone.id}
              onClick={() => handleToneClick(tone.id)}
              className={`w-full flex items-center justify-between shadow-lg rounded-xl px-4 py-2 text-sm transition-all duration-200 group ${
                tone.current
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white shadow-lg shadow-cyan-500/10"
                  : "bg-gray-800/80 hover:bg-gray-700/90 text-gray-300 hover:text-white border border-transparent hover:border-gray-600/50"
              }`}
            >
              <span className="font-medium">{tone.name}</span>
              {tone.current && (
                <Check className="text-cyan-400 w-4 h-4" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleSetTone}
          className="px-6 py-2.5 w-full font-medium rounded-xl bg-gradient-to-r from-purple-800 to-blue-800 text-white hover:from-purple-900 hover:to-blue-900 transition-all duration-200 shadow-lg shadow-purple-800/25 hover:scale-105"
          aria-label="Set Tone"
        >
          Set Tone
        </button>
      </div>
    </div>
  );
};

export default TonesModal;
