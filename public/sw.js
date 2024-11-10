const staticName = "cached-v10";
const assets = [
  // Manifest file
  "./manifest.json",

  // Page files
  "./pages/homepage.html",
  "./pages/scan-camera.html",
  "./pages/style.css",
  "./pages/sender-success-page.html",
  "./pages/receiver-success-page.html",
  "./pages/camera.html",
  "./pages/senders-QR-code.html",
  "./pages/senders-confirmation.html",
  "./pages/request-payment.html",
  "./pages/confirmation-page-request.html",
  "./pages/QR-code.html",
  "./pages/receivers-scan-camera.html",
  "./pages/warning.html",
  "./pages/enter-pin-page.html",
  "./pages/html5-qrcode.min.js",
  "./pages/camera-receiver.html",
  "./pages/login-page.html",
  "./pages/create-pin.html",
  "./pages/error-page.html",
  "./pages/fallbackPage.html",
  "./index.html",

  // Import source files
  "./src/payment.js",
  "./src/senderSuccessPage.js",
  "./src/receiverSuccessPage.js",
  "./src/time.js",
  "./src/app.js",

  // Images
  "./assets/img/send.png",
  "./assets/img/transfer.png",
  "./assets/img/sync.png",
  "./assets/img/backArrow.png",
  "./assets/img/photoCamera.png",
  "./assets/img/paper-plane1.ico",
  "./assets/img/menu.png",
  "./assets/img/paper-plane2.ico",
  "./assets/img/visibility_off.png",
  "./assets/img/visibility.png",
  "./assets/img/receive.png",
  "./assets/img/WM-logo.png",
  "./assets/img/gen.ico",
  "./assets/img/housing.ico",
  "./assets/img/eating.ico",
  "./assets/img/repair.ico",
  "./assets/img/clothing.ico",
  "./assets/img/book.ico",
  "./assets/img/medical.ico",
  "./assets/img/groceries.ico",
  "./assets/img/nepa.ico",
  "./assets/img/water.ico",
  "./assets/img/personal-care.ico",
  "./assets/img/charity.ico",
  "./assets/img/transport.ico",
  "./assets/img/funiture.ico",
  "./assets/img/religion.ico",
  "./assets/img/lent-out.ico",
  "./assets/img/edu.ico",

  // Bundled files
  "./dist/homePage.bundle.js",
  "./dist/fundBalance.bundle.js",
  "./dist/enterPin.bundle.js",
  "./dist/receiverInfo.bundle.js",
  "./dist/receiverSuccessPage.bundle.js",
  "./dist/receiverCamera.bundle.js",
  "./dist/senderCamera.bundle.js",
  "./dist/senderQRcode.bundle.js",
  "./dist/sellerGenerate.bundle.js",
  "./dist/senderConfirmation.bundle.js",
  "./dist/senderSuccessPage.bundle.js",
  "./dist/loginPage.bundle.js",
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(staticName).then(async (cache) => {
      console.log("Caching assets during install...");
      console.log("Successfully cached all assets...");

      for (const asset of assets) {
        try {
          await cache.add(asset);
          console.log(`Cached asset: ${asset}`);
        } catch (error) {
          console.error(`Failed to cache asset: ${asset}`, error);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticName)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); 
});

self.addEventListener("fetch", (evt) => {
  if (evt.request.url.startsWith("chrome-extension://")) {
    return;
  }

  evt.respondWith(
    caches.open(staticName).then(async (cache) => {
      if (evt.request.method !== "GET") {
        return fetch(evt.request);
      }

      const cacheRes = await cache.match(evt.request);
      const fetchPromise = fetch(evt.request)
        .then((fetchRes) => {
          if (fetchRes && fetchRes.status === 200) {
            cache.put(evt.request, fetchRes.clone()); 
          }
          return fetchRes;
        })
        .catch(async (err) => {
          console.error("Network fetch failed:", err);

          const fallback = await cache.match("./pages/fallbackPage.html");
          if (fallback) {
            return fallback;
          } else {
            return new Response("Service Unavailable", {
              status: 503,
              statusText: "Service Unavailable",
            });
          }
        });

      return cacheRes || fetchPromise; 
    })
  );
});
