// Request permission
export const askPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Notifications are blocked ");
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
