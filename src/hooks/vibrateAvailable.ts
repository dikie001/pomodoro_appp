import { useState, useEffect } from "react";

export const useVibrationAvailable = () => {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    // "navigator.vibrate" exists only on devices that can vibrate
    setAvailable("vibrate" in navigator);
  }, []);

  return available;
};
