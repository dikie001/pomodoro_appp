import { useEffect, useState } from "react";


const LoadingModal = () => {
    const [mode, setMode]=useState<string|null>(null)

    useEffect(()=>{
        const currentMode = localStorage.getItem("mode_type")
setMode(currentMode)    })
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`${mode==="focus"?'bg-blue-500/20 border-blue-600/40':mode==="short"?"bg-green-500/20 border-green-600/40":"bg-purple-500/20 border-purple-600/40"} backdrop-blur-xl border  rounded-3xl p-8 text-center`}>
        {/* Spinning gear icon */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-2 border-white/20 rounded-full"></div>
          <div
            className="absolute inset-2 border-2 border-transparent border-t-white/60 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">
          Initializing...
        </h3>
        <p className="text-white/60 text-sm">Please wait a moment</p>
      </div>
    </div>
  );
};

export default LoadingModal;
