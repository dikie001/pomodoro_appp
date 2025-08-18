import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import useSound from "../hooks/useSound";

interface MainProps {
  setShowTones: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<string>>
}

const TONE_KEY = "tone";

const TonesModal = ({ setShowTones,setSuccess }: MainProps) => {
  const [tones, setTones] = useState([
    { id: 1, name: "Tone 1", current: true },
    { id: 2, name: "Tone 2", current: false },
    { id: 3, name: "Tone 3", current: false },
    { id: 4, name: "Tone 4", current: false },
    { id: 5, name: "Tone 5", current: false },
  ]);

  const { playTone1, playTone2, playTone3, playTone4, playTone5, pauseSound } =
    useSound();
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const settings = localStorage.getItem(TONE_KEY);
    const toneId = settings ? Number(settings) : 0;

    setTones((prev) =>
      prev.map((tone) =>
        tone.id === toneId
          ? { ...tone, current: true }
          : { ...tone, current: false }
      )
    );
  };

  //handle tone buttons click
  const handleToneClick = (id: number) => {
    pauseSound();
    id === 1
      ? playTone1()
      : id === 2
      ? playTone2()
      : id === 3
      ? playTone3()
      : id === 4
      ? playTone4()
      : id === 5
      ? playTone5()
      : "";
    localStorage.setItem(TONE_KEY, JSON.stringify(id));
    loadSettings();
  };
  return (
    <div className="absolute  z-54 top-6 right-0   ">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <h1 className="mb-4 border-b border-gray-700 pb-2 text-center text-lg font-semibold text-white">
          🎵 Choose a Tone
        </h1>

        <div className="flex flex-col gap-2">
          {tones.map((tone) => (
            <button
              key={tone.id}
              onClick={() => handleToneClick(tone.id)}
              className="w-full flex min-w-50 items-center justify-between rounded-xl bg-gray-800 shadow-lg  px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-700/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span>{tone.name}</span>
              {tone.current && (
                <Check className="text-cyan-500" size={18} strokeWidth={2.5} />
              )}
            </button>
          ))}
          <p
            onClick={() => {
              setShowTones(false);
              pauseSound()
              setSuccess("tones")
              setTimeout(()=>{
                setSuccess("")
              },2000)
              
            }}
            className="text-center active:underline cursor-pointer text-sm mt-1 text-cyan-400 font-medium"
          >
            Set Tone
          </p>
        </div>
      </div>
    </div>
  );
};

export default TonesModal;
