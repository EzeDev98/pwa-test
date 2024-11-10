const staticName = "cached-v11";
const assets = [
  // Manifest file
  "/pwa-test/manifest.json",

  // Page files
  "/pwa-test/public/pages/homepage.html",
  "/pwa-test/public/pages/scan-camera.html",
  "/pwa-test/public/pages/style.css",
  "/pwa-test/public/pages/sender-success-page.html",
  "/pwa-test/public/pages/receiver-success-page.html",
  "/pwa-test/public/pages/camera.html",
  "/pwa-test/public/pages/senders-QR-code.html",
  "/pwa-test/public/pages/senders-confirmation.html",
  "/pwa-test/public/pages/request-payment.html",
  "/pwa-test/public/pages/confirmation-page-request.html",
  "/pwa-test/public/pages/QR-code.html",
  "/pwa-test/public/pages/receivers-scan-camera.html",
  "/pwa-test/public/pages/warning.html",
  "/pwa-test/public/pages/enter-pin-page.html",
  "/pwa-test/public/pages/html5-qrcode.min.js",
  "/pwa-test/public/pages/camera-receiver.html",
  "/pwa-test/public/pages/login-page.html",
  "/pwa-test/public/pages/create-pin.html",
  "/pwa-test/public/pages/error-page.html",
  "/pwa-test/public/pages/fallbackPage.html",
  "/pwa-test/index.html",

  // Import source files
  "/pwa-test/public/src/payment.js",
  "/pwa-test/public/src/senderSuccessPage.js",
  "/pwa-test/public/src/receiverSuccessPage.js",
  "/pwa-test/public/src/time.js",
  "/pwa-test/public/src/app.js",

  // Images
  "/pwa-test/public/assets/img/send.png",
  "/pwa-test/public/assets/img/transfer.png",
  "/pwa-test/public/assets/img/sync.png",
  "/pwa-test/public/assets/img/backArrow.png",
  "/pwa-test/public/assets/img/photoCamera.png",
  "/pwa-test/public/assets/img/paper-plane1.ico",
  "/pwa-test/public/assets/img/menu.png",
  "/pwa-test/public/assets/img/paper-plane2.ico",
  "/pwa-test/public/assets/img/visibility_off.png",
  "/pwa-test/public/assets/img/visibility.png",
  "/pwa-test/public/assets/img/receive.png",
  "/pwa-test/public/assets/img/WM-logo.png",
  "/pwa-test/public/assets/img/gen.ico",
  "/pwa-test/public/assets/img/housing.ico",
  "/pwa-test/public/assets/img/eating.ico",
  "/pwa-test/public/assets/img/repair.ico",
  "/pwa-test/public/assets/img/clothing.ico",
  "/pwa-test/public/assets/img/book.ico",
  "/pwa-test/public/assets/img/medical.ico",
  "/pwa-test/public/assets/img/groceries.ico",
  "/pwa-test/public/assets/img/nepa.ico",
  "/pwa-test/public/assets/img/water.ico",
  "/pwa-test/public/assets/img/personal-care.ico",
  "/pwa-test/public/assets/img/charity.ico",
  "/pwa-test/public/assets/img/transport.ico",
  "/pwa-test/public/assets/img/funiture.ico",
  "/pwa-test/public/assets/img/religion.ico",
  "/pwa-test/public/assets/img/lent-out.ico",
  "/pwa-test/public/assets/img/edu.ico",

  // Bundled files
  "/pwa-test/public/dist/homePage.bundle.js",
  "/pwa-test/public/dist/fundBalance.bundle.js",
  "/pwa-test/public/dist/enterPin.bundle.js",
  "/pwa-test/public/dist/receiverInfo.bundle.js",
  "/pwa-test/public/dist/receiverSuccessPage.bundle.js",
  "/pwa-test/public/dist/receiverCamera.bundle.js",
  "/pwa-test/public/dist/senderCamera.bundle.js",
  "/pwa-test/public/dist/senderQRcode.bundle.js",
  "/pwa-test/public/dist/sellerGenerate.bundle.js",
  "/pwa-test/public/dist/senderConfirmation.bundle.js",
  "/pwa-test/public/dist/senderSuccessPage.bundle.js",
  "/pwa-test/public/dist/loginPage.bundle.js",
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
