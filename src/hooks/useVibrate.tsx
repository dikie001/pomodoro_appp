export const vibrate = (pattern?: number | number[]) => {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern || 200);
    // default 200ms  
  } else {
    console.warn("Vibration not supported");
  }
};
