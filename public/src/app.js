let deferredPrompt;

// Show the "Get App" button regardless
const getAppBtn = document.getElementById("get-app-btn");

if (getAppBtn) {
  getAppBtn.style.display = "block";
}

// Check if the PWA is already installed
async function confirmPwaInstallation() {
  if ('getInstalledRelatedApps' in navigator) {
    const relatedApps = await navigator.getInstalledRelatedApps();
    if (relatedApps.length > 0) {
      // App is already installed, hide the install button
      if (getAppBtn) {
        getAppBtn.style.display = "none";
      }
    }
  }
}

// Call the function to check if PWA is installed
confirmPwaInstallation();

// Listen for the `beforeinstallprompt` event
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the default install prompt
  e.preventDefault();
  // Store the event so it can be triggered later
  deferredPrompt = e;

  // Show the "Get App" button again if conditions are met
  if (getAppBtn) {
    getAppBtn.style.display = "block";
  }
});

// Handle the "Get App" button click
if (getAppBtn) {
  getAppBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      // Clear the deferredPrompt variable to avoid re-prompting
      deferredPrompt = null;
    } else {
      console.log("Install prompt is not available");
    }
  });
}

// Register service worker if available
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pwa-test/sw.js')
      .then(reg => console.log("Service Worker registered", reg))
      .catch(err => console.log("Service Worker registration failed", err));
  });
}
