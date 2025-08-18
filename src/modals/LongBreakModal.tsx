import { useState } from "react";

// Long Break Modal
interface LongBreakModalProps {
  setShowLongBreakModal: React.Dispatch<React.SetStateAction<boolean>>;
  onLongBreakValueSelect: (value: number, description: string) => void;
}

const MODE = "mode_type";

const LongBreakModal: React.FC<LongBreakModalProps> = ({
  setShowLongBreakModal,
  onLongBreakValueSelect,
}) => {
  const longBreakDurations = [
    { value: 15, label: "15 mins", description: "Quick recharge" },
    { value: 20, label: "20 mins", description: "Standard long" },
    { value: 30, label: "30 mins", description: "Extended rest" },
    { value: 45, label: "45 mins", description: "Deep recharge" },
    { value: 60, label: "60 mins", description: "Full reset" },
    {
      value: 100,
      label: "Flexible Time",
      description: "Define your break duration",
    },
  ];

  const handleClose = () => setShowLongBreakModal(false);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>("");

  const handleDurationSelect = (value: number, description: string) => {
    if (value === 100) {
      setShowCustomInput(true);
      return;
    }
    handleClose();
    onLongBreakValueSelect(value, description);
    localStorage.setItem(MODE, "long");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  //initiate timer with custom value
  const handleConfirm = () => {
    setShowCustomInput(false);
    handleClose();
    handleDurationSelect(Number(customValue), "Flexible break");
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-400/30 rounded-3xl shadow-2xl shadow-purple-900/40 p-8 max-w-md w-full transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="long-break-modal-title"
        aria-modal="true"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-400/20 rounded-full mb-4">
            <span className="text-3xl">🌙</span>
          </div>
          <h2
            id="long-break-modal-title"
            className="text-3xl font-bold text-white mb-2 tracking-tight"
          >
            Long Break
          </h2>
          <p className="text-white/70 text-sm">
            Extended rest for complete rejuvenation
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {longBreakDurations.map(({ value, label, description }) => (
            <button
              key={value}
              className="group relative bg-purple-500/10 hover:bg-purple-400/20 border border-purple-400/20 hover:border-purple-300/40 px-6 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              onClick={() => handleDurationSelect(value, description)}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-white font-semibold text-lg">
                    {label}
                  </div>
                  <div className="text-purple-200/60 text-sm">
                    {description}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ))}
        </div>

        <button
          className="w-full bg-purple-500/10 hover:bg-purple-400/20 border border-purple-400/20 text-purple-100/80 hover:text-white py-3 rounded-2xl transition-all duration-200 text-sm font-medium"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>

      {/* MODALS */}
      {/* Custom duration modal */}
      {showCustomInput && (
        <div
          onClick={handleClose}
          className="fixed bg-black/50 z-60 inset-0 flex justify-center items-center backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-400/30 rounded-3xl shadow-2xl shadow-purple-900/40 p-8 max-w-md w-full transform transition-all duration-200 scale-100"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Set Duration
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                Enter the duration of your Long break
              </p>
            </div>

            <div className="mb-6">
              <input
                type="number"
                placeholder="Duration in minutes "
                value={customValue}
                autoFocus
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCustomValue(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all backdrop-blur-sm"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCustomInput(false)}
                className="px-6 py-2.5 rounded-xl font-medium bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-200 border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 font-medium rounded-xl bg-gradient-to-r from-purple-800 to-blue-800 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LongBreakModal;
