import {
  Bed,
  Coffee,
  Focus,
  Gamepad,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Volume2,
  VolumeOff,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import FocusModal from "../modals/FocusModal";
import LoadingModal from "../modals/LoadingModal";
import LongBreakModal from "../modals/LongBreakModal";
import ShortBreakModal from "../modals/ShortBreakModal";
import useSound from "../hooks/useSound";
import SettingsModal from "../modals/SettingsModal";
import { showLocalNotification } from "../utils/askPermission";
import { vibrate } from "../hooks/useVibrate";
import NeonReactionBlaster from "../modals/Game";

const MODE = "mode_type";

const MainPage: React.FC = () => {
  const [showFocusModal, setShowFocusModal] = useState<boolean>(false);
  const [showGame, setShowGame] = useState(false);
  const [initialize, setInitialize] = useState<boolean>(false);
  const [allowSound, setAllowSound] = useState<boolean>(true);
  const soundSettingsRef = useRef<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const timeForResetRef = useRef<number | null>(null);
  const [showShortBreakModal, setShowShortBreakModal] =
    useState<boolean>(false);
  const [showLongBreakModal, setShowLongBreakModal] = useState<boolean>(false);
  const modeTypeRef = useRef<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [mode, setMode] = useState<string>("Classic Pomodoro");
  const [focusTime, setFocusTime] = useState<number>(1500);
  const [progress, setProgress] = useState<number>(0);
  const [focusRemainingTime, setFocusRemainingTime] = useState<string>("25:00");
  const initialValueRef = useRef<number>(1500);
  const vibrateRef = useRef<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const toneNumberRef = useRef<number | null>(null);
  const notificationRef = useRef<string | null>(null);

  const {
    playStart,
    playTone1,
    playTone2,
    playTone3,
    playTone4,
    playTone5,
    pauseSound,
  } = useSound();

  const handleFocusMode = (value: number, description: string) => {
    setInitialize(true);
    setMode(description);
    checkMode();

    setTimeout(() => {
      const totalSeconds = value * 60;
      setFocusTime(totalSeconds);
      timeForResetRef.current = value;
      initialValueRef.current = totalSeconds;
      setPlaying(true);
      allowSound && playStart();
    }, 1050);
  };

  // restart the timer
  const handleRestart = () => {
    pauseSound();
    handleFocusMode(
      timeForResetRef.current ? timeForResetRef.current : 25,
      mode
    );
  };

  useEffect(() => {
    // checkMode();
    console.log(focusTime);
    setTheme("focus");
    getSoundSettings();
    getNotificationSettings();
    getVibrateSettings();
  }, []);

  //get vibrate settings
  const getVibrateSettings = () => {
    const vibrateSettings = localStorage.getItem("vibrate");
    vibrateRef.current = vibrateSettings;
  };
  //get notification settings from storage
  const getNotificationSettings = () => {
    const notificationSettings = localStorage.getItem("notifications");
    notificationRef.current = notificationSettings;
  };

  //get the sound and tone settings from storage
  const getSoundSettings = () => {
    const sound = localStorage.getItem("sound");
    const tone = localStorage.getItem("tone");
    const toneNumber = tone ? Number(tone) : 1;
    toneNumberRef.current = toneNumber;

    if (sound === "true") {
      setAllowSound(true);
      soundSettingsRef.current = true;
    } else if (sound === "false") {
      setAllowSound(false);
      soundSettingsRef.current = false;
    } else if (!sound) setAllowSound(true);
  };

  //function to run everytime the settings modal closes
  useEffect(() => {
    getSoundSettings();
    getNotificationSettings();
    getVibrateSettings();
  }, [showSettings]);

  // Get the current mode from local storage for theming
  const checkMode = async () => {
    setTimeout(() => {
      const currentMode = localStorage.getItem(MODE) as
        | "focus"
        | "short"
        | "long"
        | null;
      if (currentMode) {
        modeTypeRef.current = currentMode;
        setTheme(currentMode);
        if (notificationRef.current === "true") {
          currentMode === "focus"
            ? showLocalNotification("Focus", "Focus mode started — lock in!")
            : currentMode === "short"
            ? showLocalNotification(
                "Short Break",
                "Quick break — stretch it out."
              )
            : currentMode === "long"
            ? showLocalNotification(
                "Long Break",
                "Long break — relax & recharge."
              )
            : "";
        }
      }
      setInitialize(false);
    }, 1000);
  };

  //handle play/pause button click
  const handlePlay = () => {
    pauseSound();
    if (initialValueRef.current === 0) return;
    setPlaying(!playing);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // handle sound button click/// sound settings
  const handleSoundClick = () => {
    if (allowSound) pauseSound();
    setAllowSound(!allowSound);
    soundSettingsRef.current = !soundSettingsRef.current;
    localStorage.setItem("sound", JSON.stringify(soundSettingsRef.current));
  };

  //initiate timer
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setFocusTime((prev) => {
          if (prev <= -1) {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              setMode("");
              initialValueRef.current = 0;
              setPlaying(false);

              // Show notifications
              if (notificationRef.current === "true") {
                modeTypeRef.current === "focus"
                  ? showLocalNotification(
                      "Focus",
                      "Focus session complete! Time for a breather."
                    )
                  : modeTypeRef.current === "short"
                  ? showLocalNotification(
                      "Short Break",
                      "Short break over, let’s get back in!"
                    )
                  : modeTypeRef.current === "long"
                  ? showLocalNotification(
                      "Long Break",
                      "Long break done. Ready to crush it?"
                    )
                  : "";
              }

              // Vibrate the device
              if (vibrateRef.current === "true") {
                vibrate(5000);
                console.log("vibrating");
              }
              // Select tone based on user settings
              if (allowSound) {
                toneNumberRef.current === 1
                  ? playTone1()
                  : toneNumberRef.current === 2
                  ? playTone2()
                  : toneNumberRef.current === 3
                  ? playTone3()
                  : toneNumberRef.current === 4
                  ? playTone4()
                  : playTone5();
              }
            }
            return 0;
          }
          const minutes = Math.floor(prev / 60);
          const seconds = prev % 60;
          setFocusRemainingTime(
            `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`
          );
          const calculation: number = Number(
            ((prev / initialValueRef.current) * 100).toFixed(0)
          );
          setProgress(calculation);

          return prev - 1;
        });
        ``;
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [playing]);

  return (
    <div
      className={`${
        theme === "focus"
          ? "bg-gradient-to-bl from-blue-950  to-indigo-950"
          : theme === "short"
          ? "bg-gradient-to-bl from-green-950 to-emerald-950"
          : theme === "long"
          ? "bg-gradient-to-bl from-purple-950 to-indigo-950"
          : "bg-gradient-to-bl from-purple-950 via-blue-950 to-green-950 "
      } min-h-screen  text-white`}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <img
            src="/images/logo.png"
            alt="Focus Image"
            height={35}
            width={35}
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Focus
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowGame(!showGame);
              pauseSound();
            }}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <Gamepad className="w-4 h-4" />
          </button>
          <button
            onClick={handleSoundClick}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            {allowSound ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              pauseSound();
            }}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Timer */}
      <h2 className="text-2xl font-semibold text-center pt-4 font-mono">
        {theme === "focus"
          ? "Focus Session "
          : theme === "short"
          ? "Short Break"
          : theme === "long"
          ? "Long Break"
          : ""}
      </h2>

      <main className="flex-1 flex items-center justify-center pt-4 px-8 pb-6">
        <div className="relative w-74 h-72 ">
          {/*Background circle */}
          <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="progress" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={progress < 30 ? "red" : "cyan"} />
                <stop
                  offset="100%"
                  stopColor={progress < 30 ? "red" : "cyan"}
                />
              </linearGradient>
            </defs>

            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#4a5565"
              strokeWidth="4"
              fill="transparent"
            />

            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#progress)"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="drop-shadow-lg transition-all text-gray-600 duration-500"
            />
          </svg>

          {/*  Content inside */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-mono font-bold bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent">
              <p>{focusRemainingTime}</p>
            </div>
            <div className="text-purple-300 text-lg font-medium">{mode}</div>
            <div
              className={`${
                mode === "" && "mt-6"
              } mt-4 flex items-center space-x-6`}
            >
              <button
                onClick={handlePlay}
                className={`${
                  mode === "" && "w-18 h-18"
                } w-14 h-14  lg:w-16 lg:h-16 bg-gradient-to-r from-cyan-800 to-cyan-950    rounded-full flex items-center justify-center hover:scale-105 shadow-lg  transition`}
              >
                {playing ? (
                  <Pause className="w-7 h-7 ml-1" />
                ) : (
                  <Play className="w-7 h-7 ml-1" />
                )}
              </button>
              {playing && (
                <button
                  onClick={handleRestart}
                  className="w-14 h-14 shadow-lg lg:w-16 lg:h-16 bg-gradient-to-r from-white/15 to-white/5  rounded-full flex items-center justify-center hover:scale-105 transition"
                >
                  <RotateCcw className="w-6 h-6 " />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mode Selector */}
      <div className="p-4 flex justify-center gap-2 lg:gap-4 w-full max-w-lg items-center m-auto">
        <button
          onClick={() => {
            setShowFocusModal(true);
            setMode("focus");
            pauseSound();
          }}
          className={`${
            theme === "focus" && "ring-2 ring-blue-400/60"
          } p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl flex flex-col items-center space-y-1  w-full shadow-lg  shadow-black/20`}
        >
          <Focus className="w-6 h-6" />
          <span className="max-sm:text-sm">Focus</span>
        </button>
        <button
          onClick={() => {
            setShowShortBreakModal(true);
            pauseSound();
          }}
          className={`${
            theme === "short" && "ring-2 ring-emerald-400/60"
          } p-3 bg-emerald-500/20 hover:bg-emerald-500/30  rounded-xl flex flex-col items-center space-y-1 w-full shadow-lg shadow-black/20`}
        >
          <Coffee className="w-6 h-6" />
          <span className="max-sm:text-sm">Short Break</span>
        </button>
        <button
          onClick={() => {
            setShowLongBreakModal(true);
            pauseSound();
          }}
          className={`${
            theme === "long" && "ring-2 ring-purple-400/60"
          } p-3 bg-purple-500/20 hover:bg-purple-500/30  rounded-xl flex flex-col items-center space-y-1 shadow-lg w-full shadow-black/20`}
        >
          <Bed className="w-6 h-6" />
          <span className="max-sm:text-sm">Long Break</span>
        </button>
      </div>
      {/* MODALS */}
      {showFocusModal && (
        <FocusModal
          setShowFocusModal={setShowFocusModal}
          onFocusValueSelect={handleFocusMode}
        />
      )}

      {showShortBreakModal && (
        <ShortBreakModal
          onShortBreakValueSelect={handleFocusMode}
          setShowShortBreakModal={setShowShortBreakModal}
        />
      )}

      {showLongBreakModal && (
        <LongBreakModal
          onLongBreakValueSelect={handleFocusMode}
          setShowLongBreakModal={setShowLongBreakModal}
        />
      )}

      {showSettings && (
        <SettingsModal
          setShowSettingsModal={setShowSettings}
          allowSound={allowSound}
          setAllowSound={setAllowSound}
        />
      )}

      {initialize && <LoadingModal />}
      {showGame && (
        <div className="absolute z-50 inset-0">
          <NeonReactionBlaster />
        </div>
      )}
    </div>
  );
};

export default MainPage;
