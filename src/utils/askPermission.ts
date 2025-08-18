// Request permission
export const askPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert(
      "Notifications are blocked in your browser settings. Please enable them manually."
    );
    return false
  }
};

// Show notification
export const showLocalNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        reg.showNotification(title, {
          body,
          icon: "/images/logo.png",
        });
      }
    });
  }
};
