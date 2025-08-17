// Short Break Modal
interface ShortBreakModalProps {
  setShowShortBreakModal: React.Dispatch<React.SetStateAction<boolean>>;
  onShortBreakValueSelect: (value: number, description: string) => void;
}

const MODE = "mode_type";

const ShortBreakModal: React.FC<ShortBreakModalProps> = ({
  setShowShortBreakModal,
  onShortBreakValueSelect,
}) => {
  const shortBreakDurations = [
    { value: 3, label: "3 mins", description: "Quick stretch" },
    { value: 5, label: "5 mins", description: "Standard short" },
    { value: 8, label: "8 mins", description: "Extended short" },
    { value: 10, label: "10 mins", description: "Long short break" },
  ];

  const handleClose = () => setShowShortBreakModal(false);

  const handleDurationSelect = (value: number, description: string) => {
    handleClose();
    onShortBreakValueSelect(value, description);
    localStorage.setItem(MODE, "short");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-3xl shadow-2xl shadow-green-900/40 p-8 max-w-md w-full transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="short-break-modal-title"
        aria-modal="true"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400/20 rounded-full mb-4">
            <span className="text-3xl">⚡</span>
          </div>
          <h2
            id="short-break-modal-title"
            className="text-3xl font-bold text-white mb-2 tracking-tight"
          >
            Short Break
          </h2>
          <p className="text-white/70 text-sm">
            Quick refresh to keep your momentum
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {shortBreakDurations.map(({ value, label, description }) => (
            <button
              key={value}
              className="group relative bg-green-500/10 hover:bg-green-400/20 border border-green-400/20 hover:border-green-300/40 px-4 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-400/50"
              onClick={() => handleDurationSelect(value, description)}
            >
              <div className="text-center">
                <div className="text-white font-semibold text-lg mb-1">
                  {label}
                </div>
                <div className="text-green-200/60 text-xs">{description}</div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ))}
        </div>

        <button
          className="w-full bg-green-500/10 hover:bg-green-400/20 border border-green-400/20 text-green-100/80 hover:text-white py-3 rounded-2xl transition-all duration-200 text-sm font-medium"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShortBreakModal;
