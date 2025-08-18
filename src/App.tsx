import { useEffect, useState } from "react";
import { Download, X, Smartphone, Monitor } from "lucide-react";
import MainPage from "./pages/MainPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  /**
   * Sets up PWA install prompt event listener
   */
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /**
   * Handles PWA installation when user clicks install button
   */
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // @ts-ignore - PWA API types not fully supported
      deferredPrompt.prompt();
      // @ts-ignore
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User response:", outcome);
    } catch (error) {
      console.error("Install prompt failed:", error);
    } finally {
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  /**
   * Dismisses the install prompt
   */
  const handleDismiss = () => {
    setShowInstall(false);
    setDeferredPrompt(null);
  };

  return (
    <>
      <Toaster />
      <MainPage />

      {/* PWA Install Prompt */}
      {showInstall && (
        <div className="fixed inset-x-4 bottom-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
          <div className="mx-auto max-w-sm">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 to-blue-950  backdrop-blur-xl shadow-xl ">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-emerald-500/20 to-purple-600/20 opacity-50 animate-pulse" />

              {/* Content */}
              <div className="relative p-6">
                {/* Header with Close Button */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Install Focus
                      </h3>
                      <p className="text-sm text-gray-300">
                        Get quick access to your productivity timer
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Dismiss install prompt"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Features */}
                <div className="flex items-center justify-center space-x-8 mb-6">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs text-gray-300">Mobile Ready</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Monitor className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-xs text-gray-300">Desktop App</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-blue-400" />
                    </div>
                    <span className="text-xs text-gray-300">Offline Mode</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium transition-all duration-200"
                  >
                    Not Now
                  </button>
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-emerald-700  hover:from-blue-800 hover:to-emerald-800 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                  >
                    Install
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
