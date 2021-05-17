// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests
self.addEventListener('install', function(event) {
    var CACHE_NAME = 'Lab7cache';
    var urlsToCache = [
      'https://cse110lab6.herokuapp.com/entries',
    ];
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          return cache.addAll(urlsToCache);
        })
    );
       
  }); 

  self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
  });
  

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }

          var fetchRequest = event.request.clone();
          return fetch(fetchRequest).then(
            function(response) {
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              var responseToCache = response.clone();
              var CACHE_NAME = 'Lab7cache';
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });
