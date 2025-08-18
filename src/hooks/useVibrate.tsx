export const vibrate = (pattern?: number | number[]) => {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern || 5000);
    // default 5000ms  
  } else {
    console.warn("Vibration not supported");
  }
};
