interface FocusModalProps {
  setShowFocusModal: React.Dispatch<React.SetStateAction<boolean>>;
  onFocusValueSelect: (value: number, description: string) => void;
}

const MODE = "mode_type";

const FocusModal: React.FC<FocusModalProps> = ({
  setShowFocusModal,
  onFocusValueSelect,
}) => {
  const focusDurations = [
    { value: 0.1, label: "6 seconds", description: "Quick test" },

    { value: 15, label: "15 mins", description: "Quick focus" },
    { value: 25, label: "25 mins", description: "Classic pomodoro" },
    { value: 35, label: "35 mins", description: "Extended focus" },
    { value: 45, label: "45 mins", description: "Deep work" },
    { value: 60, label: "60 mins", description: "Long session" },
  ];

  const handleClose = () => setShowFocusModal(false);

  const handleDurationSelect = (value: number, description: string) => {
    handleClose();
    onFocusValueSelect(value, description);
    localStorage.setItem(MODE, "focus");
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
        className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/40 p-8 max-w-md w-full transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="focus-modal-title"
        aria-modal="true"
      >
        <div className="text-center mb-6">
          <img src="/images/logo.png" alt="focus image" height={50} width={50} className="flex mb-4 justify-center items-center mx-auto"/>
          <h2
            id="focus-modal-title"
            className="text-3xl font-bold text-white mb-2 tracking-tight"
          >
            Focus Duration
          </h2>
          <p className="text-white/70 text-sm">
            Choose your pomodoro session length
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {focusDurations.map(({ value, label, description }) => (
            <button
              key={value}
              className="group relative bg-blue-500/10  hover:bg-white/20 border border-white/20 hover:border-white/40 px-6 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              onClick={() => handleDurationSelect(value, description)}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-white font-semibold text-lg">
                    {label}
                  </div>
                  <div className="text-white/60 text-sm">{description}</div>
                </div>
                <div className="text-white/40 group-hover:text-white/60 transition-colors"></div>
              </div>
            </button>
          ))}
        </div>

        <button
          className="w-full bg-blue-500/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white py-3 rounded-2xl transition-all duration-200 text-sm font-medium"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FocusModal;
