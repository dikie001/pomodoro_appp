import React, { useState, useEffect } from "react";
import {
  X,
  Volume2,
  VolumeOff,
  Moon,
  Sun,
  Music,
  ChevronDown,
  ChevronRight,
  Vibrate,
  VibrateOff,
} from "lucide-react";
import TonesModal from "./TonesModal";
import { askPermission } from "../utils/askPermission";
import toast from "react-hot-toast";
import { useVibrationAvailable } from "../hooks/vibrateAvailable";

interface SettingsModalProps {
  setShowSettingsModal: (show: boolean) => void;
  allowSound: boolean;
  setAllowSound: (allow: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  setShowSettingsModal,
  allowSound,
  setAllowSound,
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<boolean>(false);
  const [showTones, setShowTones] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [allowVibrate, setAllowVibrate] = useState<boolean>(false);

  const vibrateAvailable = useVibrationAvailable();

  // Loads settings from localStorage on component mount

  useEffect(() => {
    console.log(vibrateAvailable);
    try {
      const savedDarkMode = localStorage.getItem("darkMode");
      const savedNotifications = localStorage.getItem("notifications");
      const savedVibration = localStorage.getItem("vibrate");

      setDarkMode(savedDarkMode !== "false");
      setNotifications(savedNotifications === "true");
      setAllowVibrate(savedVibration === "true");
    } catch (error) {
      console.warn("Failed to load settings:", error);
    }
  }, []);

  //  Handles sound toggle and saves to localStorage

  const handleSoundToggle = () => {
    const newSoundState = !allowSound;
    setAllowSound(newSoundState);
    try {
      localStorage.setItem("sound", JSON.stringify(newSoundState));
    } catch (error) {
      console.warn("Failed to save sound setting:", error);
    }
  };

  //Handles vibrate toggle
  const handleVibrationToggle = () => {
    const newVibrationState = !allowVibrate;
    setAllowVibrate(newVibrationState);

    try {
      localStorage.setItem("vibrate", JSON.stringify(newVibrationState));
    } catch (error) {
      console.warn("Failed to save vibration setting:", error);
    }
  };

  //   Handles dark mode toggle and saves to localStorage

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    if (!newDarkMode) toast.error("Light mode not enabled!");
    setDarkMode(newDarkMode);
    try {
      localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    } catch (error) {
      console.warn("Failed to save dark mode setting:", error);
    }
  };

  // Handles notification toggle and saves to localStorage

  const handleNotificationToggle = () => {
    const newNotificationState = !notifications;
    setNotifications(newNotificationState);
    if (newNotificationState) {
      askPermission();
      console.log("asking....");
    } // Request permission for notifications

    // Save the new notification state to localStorage
    try {
      localStorage.setItem(
        "notifications",
        JSON.stringify(newNotificationState)
      );
    } catch (error) {
      console.log("error");
      console.warn("Failed to save notification setting:", error);
    }
  };

  //Closes the modal when clicking outside the content area

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowSettingsModal(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_25px_60px_-12px_rgba(147,51,234,0.4)] p-2 max-w-md w-full mx-4 transform transition-all duration-300 hover:scale-[1.02] animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white ">Settings</h2>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors absolute top-2 right-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Sound Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {allowSound ? (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <VolumeOff className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-white font-medium">Sound</span>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                allowSound ? "bg-cyan-600" : "bg-gray-600"
              }`}
              aria-label="Toggle sound"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  allowSound ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Choose tone button */}
          {allowSound && (
            <div className="flex items-center relative justify-between">
              <div
                onClick={() => setShowTones(!showTones)}
                className="flex items-center space-x-3"
              >
                <Music className="text-pink-500 w-5 h-5" />
                <p className="text-white font-medium">Ringtone</p>
              </div>
              <button
                onClick={() => setShowTones(!showTones)}
                className=" h-6 w-11 flex justify-end"
              >
                {showTones ? <ChevronDown /> : <ChevronRight />}
              </button>
              {showTones && (
                <TonesModal
                  setShowTones={setShowTones}
                  setSuccess={setSuccess}
                />
              )}
            </div>
          )}

          {/* Dark Mode Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-purple-400" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
              <span className="text-white font-medium">Dark Mode</span>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                darkMode ? "bg-purple-600" : "bg-gray-600"
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Notifications Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-5 h-5 rounded-full ${
                  notifications ? "bg-green-400" : "bg-gray-500"
                } flex items-center justify-center`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    notifications ? "bg-white" : "bg-gray-300"
                  }`}
                />
              </div>
              <span className="text-white font-medium">Notifications</span>
            </div>
            <button
              onClick={handleNotificationToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                notifications ? "bg-green-600" : "bg-gray-600"
              }`}
              aria-label="Toggle notifications"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Vibration Setting */}
          {vibrateAvailable && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {allowVibrate ? (
                  <Vibrate className="w-5 h-5 text-blue-400" />
                ) : (
                  <VibrateOff className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-white font-medium">Vibrate</span>
              </div>
              <button
                onClick={handleVibrationToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  allowVibrate ? "bg-blue-600" : "bg-gray-600"
                }`}
                aria-label="Toggle vibrate mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    allowVibrate ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <button
            onClick={() => {
              setShowSettingsModal(false);
              toast.success("Setting updated!");
            }}
            className="px-6 py-2.5 w-full font-medium rounded-xl bg-gradient-to-r from-purple-800 to-blue-800 text-white hover:from-purple-900 hover:to-blue-900 transition-all duration-200 shadow-lg shadow-purple-800/25 hover:scale-105"
          >
            Save settings
          </button>
        </div>
        {/* MODALS */}
        {success !== "" && (
          <div className="absolute  top-2  py-2 px-6 font-medium rounded-xl shadow-lg shadow-black/40 left-1/2 -translate-x-1/2  bg-gradient-to-r from-cyan-900 to-blue-900 ">
            {success === "tones" && "Tones updated "}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
