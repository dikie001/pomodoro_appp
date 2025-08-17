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
} from "lucide-react";
import TonesModal from "./TonesModal";

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

  /**
   * Loads settings from localStorage on component mount
   */
  useEffect(() => {
    try {
      const savedDarkMode = localStorage.getItem("darkMode");
      const savedNotifications = localStorage.getItem("notifications");

      setDarkMode(savedDarkMode !== "false");
      setNotifications(savedNotifications === "true");
    } catch (error) {
      console.warn("Failed to load settings:", error);
    }
  }, []);

  /**
   * Handles sound toggle and saves to localStorage
   */
  const handleSoundToggle = () => {
    const newSoundState = !allowSound;
    setAllowSound(newSoundState);
    try {
      localStorage.setItem("sound", JSON.stringify(newSoundState));
    } catch (error) {
      console.warn("Failed to save sound setting:", error);
    }
  };

  //   Handles dark mode toggle and saves to localStorage

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
              {showTones && <TonesModal setShowTones={setShowTones} />}
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <button
            onClick={() => setShowSettingsModal(false)}
            className="w-full py-2 px-4 bg-gradient-to-r from-cyan-800 to-blue-800 hover:from-cyan-900 hover:to-blue-900 rounded-lg text-white font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
      {/* MODALS */}
    </div>
  );
};

export default SettingsModal;
