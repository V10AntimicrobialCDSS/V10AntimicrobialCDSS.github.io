const APP_PREFIX = 'CDSS_';
const VERSION = '1.241'; // Update the version when you make changes
const CACHE_NAME = APP_PREFIX + VERSION;

const URLS = [
  '/AbxLinks.json',
  '/Antimicrobial CDSS Frequently Asked Questions.pdf',
  '/AppInstall.html',
  '/AppInstall.jpg',
  '/CDSSLogo.png',
  '/CDSSLogoApp.png',
  '/CDSSLogoLarge.png',
  '/CDSSLogoTab.png',
  '/CDSSVALogo.png',
  '/Disclaimer.html',
  '/Resources.html',
  '/VASeal.jpg',
  '/index.html',
  '/manifest.webmanifest',
  '/service-worker.js',
  
  '/Cleveland.txml',
  '/ClevelandCDSS.html',
  '/ClevelandItemLinks.json',
  '/ClevelandOMJSON.json',
  '/ClevelandODJSON.json',

  '/AnnArbor.txml',
  '/AnnArborCDSS.html',
  '/AnnArborOMJSON.json',
  '/AnnArborODJSON.json',

  '/ChillicotheCDSS.html',
  '/ChillicotheItemLinks.json',
  '/ChillicotheOMJSON.json',
  '/ChillicotheODJSON.json',

  '/CincinnatiCDSS.html',
  '/CincinnatiItemLinks.json',
  '/CincinnatiOMJSON.json',
  '/CincinnatiODJSON.json',
  
  '/DaytonCDSS.html',
  '/DaytonItemLinks.json',
  '/DaytonOMJSON.json',
  '/DaytonODJSON.json',
  
  '/DetroitCDSS.html',
  '/DetroitItemLinks.json',
  '/DetroitOMJSON.json',
  '/DetroitODJSON.json',

  '/Indianapolis.txml',
  '/IndianapolisCDSS.html',
  '/IndianapolisItemLinks.json',
  '/IndianapolisOMJSON.json',
  '/IndianapolisODJSON.json',

  '/NorthernIndiana.txml',
  '/NorthernIndianaCDSS.html',
  '/NorthernIndianaItemLinks.json',
  '/NorthernIndianaOMJSON.json',
  '/NorthernIndianaODJSON.json',

  '/Saginaw.txml',
  '/SaginawCDSS.html',
  '/SaginawItemLinks.json',
  '/SaginawOMJSON.json',
  '/SaginawODJSON.json',

  '/Columbus.txml',
  '/ColumbusCDSS.html',
  '/ColumbusItemLinks.json',
  '/ColumbusOMJSON.json',
  '/ColumbusODJSON.json',

  '/Fonts/PTSerif-Bold.eot',
  '/Fonts/PTSerif-Bold.svg',
  '/Fonts/PTSerif-Bold.ttf',
  '/Fonts/PTSerif-Bold.woff',
  '/Fonts/PTSerif-Bold.woff2',

  '/Fonts/PTSerif-BoldItalic.eot',
  '/Fonts/PTSerif-BoldItalic.svg',
  '/Fonts/PTSerif-BoldItalic.ttf',
  '/Fonts/PTSerif-BoldItalic.woff',
  '/Fonts/PTSerif-BoldItalic.woff2',

  '/Fonts/PTSerif-Italic.eot',
  '/Fonts/PTSerif-Italic.svg',
  '/Fonts/PTSerif-Italic.ttf',
  '/Fonts/PTSerif-Italic.woff',
  '/Fonts/PTSerif-Italic.woff2',

  '/Fonts/PTSerif-Regular.eot',
  '/Fonts/PTSerif-Regular.svg',
  '/Fonts/PTSerif-Regular.ttf',
  '/Fonts/PTSerif-Regular.woff',
  '/Fonts/PTSerif-Regular.woff2',
];

self.addEventListener('install', function (e) {
  console.log('Installing service worker: ' + CACHE_NAME);

  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Caching files: ' + URLS.join(', '));
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('Activating service worker: ' + CACHE_NAME);

  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== CACHE_NAME) {
          console.log('Deleting old cache: ' + key);
          return caches.delete(key);
        }
      }));
    }).then(function () {
      console.log('Service worker activated.');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  console.log('Fetch request: ' + e.request.url);

  if (!e.request.url.startsWith(self.location.origin)) {
    console.log('Skipping caching for third-party resource: ' + e.request.url);
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function (response) {
      // Reload assets if version has changed.
      const fetchRequest = e.request.clone();

      return (
        response || fetch(fetchRequest).then(function (networkResponse) {
          // Check if we received a valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(e.request, responseToCache);
          });

          return networkResponse;
        }).catch(function (error) {
          console.error('Fetch error: ' + error);
        })
      );
    })
  );
});
