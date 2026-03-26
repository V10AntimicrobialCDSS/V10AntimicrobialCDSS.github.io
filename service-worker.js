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


  '/BattleCreek.txml',
  '/BattleCreekCDSS.html',
  '/BattleCreekOMJSON.json',
  '/BattleCreekODJSON.json',

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

  '/Fonts/Montserrat-Bold.eot',
  '/Fonts/Montserrat-Bold.svg',
  '/Fonts/Montserrat-Bold.ttf',
  '/Fonts/Montserrat-Bold.woff',
  '/Fonts/Montserrat-Bold.woff2',

  '/Fonts/Montserrat-BoldItalic.eot',
  '/Fonts/Montserrat-BoldItalic.svg',
  '/Fonts/Montserrat-BoldItalic.ttf',
  '/Fonts/Montserrat-BoldItalic.woff',
  '/Fonts/Montserrat-BoldItalic.woff2',

  '/Fonts/Montserrat-Italic.eot',
  '/Fonts/Montserrat-Italic.svg',
  '/Fonts/Montserrat-Italic.ttf',
  '/Fonts/Montserrat-Italic.woff',
  '/Fonts/Montserrat-Italic.woff2',

  '/Fonts/Montserrat-Regular.eot',
  '/Fonts/Montserrat-Regular.svg',
  '/Fonts/Montserrat-Regular.ttf',
  '/Fonts/Montserrat-Regular.woff',
  '/Fonts/Montserrat-Regular.woff2',
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
