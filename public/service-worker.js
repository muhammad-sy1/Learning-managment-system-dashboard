self.addEventListener("install", () => {
    console.log("Service Worker installed");
  });
  
  self.addEventListener("activate", () => {
    console.log("Service Worker activated");
  });
  
  // Required for iOS to enable push logic
  self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    event.waitUntil(
      self.registration.showNotification(data.title || "Notification", {
        body: data.body || "",
        icon: "/logo.png"
      })
    );
  });
  