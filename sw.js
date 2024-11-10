const staticName = "cached-v10";
const assets = [
  // Manifest file
  "./manifest.json",

  // Page files (assuming these are under `public/pages/`)
  "./public/pages/homepage.html",
  "./public/pages/scan-camera.html",
  "./public/pages/style.css",
  "./public/pages/sender-success-page.html",
  "./public/pages/receiver-success-page.html",
  "./public/pages/camera.html",
  "./public/pages/senders-QR-code.html",
  "./public/pages/senders-confirmation.html",
  "./public/pages/request-payment.html",
  "./public/pages/confirmation-page-request.html",
  "./public/pages/QR-code.html",
  "./public/pages/receivers-scan-camera.html",
  "./public/pages/warning.html",
  "./public/pages/enter-pin-page.html",
  "./public/pages/html5-qrcode.min.js",
  "./public/pages/camera-receiver.html",
  "./public/pages/login-page.html",
  "./public/pages/create-pin.html",
  "./public/pages/error-page.html",
  "./public/pages/fallbackPage.html",
  "./index.html",

  // Import source files (assuming these are under `public/src/`)
  "./public/src/payment.js",
  "./public/src/senderSuccessPage.js",
  "./public/src/receiverSuccessPage.js",
  "./public/src/time.js",
  "./public/src/app.js",

  // Images (assuming these are under `public/assets/img/`)
  "./public/assets/img/send.png",
  "./public/assets/img/transfer.png",
  "./public/assets/img/sync.png",
  "./public/assets/img/backArrow.png",
  "./public/assets/img/photoCamera.png",
  "./public/assets/img/paper-plane1.ico",
  "./public/assets/img/menu.png",
  "./public/assets/img/paper-plane2.ico",
  "./public/assets/img/visibility_off.png",
  "./public/assets/img/visibility.png",
  "./public/assets/img/receive.png",
  "./public/assets/img/WM-logo.png",
  "./public/assets/img/gen.ico",
  "./public/assets/img/housing.ico",
  "./public/assets/img/eating.ico",
  "./public/assets/img/repair.ico",
  "./public/assets/img/clothing.ico",
  "./public/assets/img/book.ico",
  "./public/assets/img/medical.ico",
  "./public/assets/img/groceries.ico",
  "./public/assets/img/nepa.ico",
  "./public/assets/img/water.ico",
  "./public/assets/img/personal-care.ico",
  "./public/assets/img/charity.ico",
  "./public/assets/img/transport.ico",
  "./public/assets/img/funiture.ico",
  "./public/assets/img/religion.ico",
  "./public/assets/img/lent-out.ico",
  "./public/assets/img/edu.ico",

  // Bundled files (assuming these are under `public/dist/`)
  "./public/dist/homePage.bundle.js",
  "./public/dist/fundBalance.bundle.js",
  "./public/dist/enterPin.bundle.js",
  "./public/dist/receiverInfo.bundle.js",
  "./public/dist/receiverSuccessPage.bundle.js",
  "./public/dist/receiverCamera.bundle.js",
  "./public/dist/senderCamera.bundle.js",
  "./public/dist/senderQRcode.bundle.js",
  "./public/dist/sellerGenerate.bundle.js",
  "./public/dist/senderConfirmation.bundle.js",
  "./public/dist/senderSuccessPage.bundle.js",
  "./public/dist/loginPage.bundle.js",
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
