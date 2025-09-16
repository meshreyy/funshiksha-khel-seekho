// FUNSHIKSHA Service Worker for Offline-First Learning
const CACHE_NAME = 'funshiksha-v1';
const OFFLINE_URL = '/offline.html';

// Essential assets to cache for offline functionality
const urlsToCache = [
  '/',
  '/offline.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add Google Fonts for multilingual support
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential resources');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] All essential resources cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement cache-first strategy for educational content
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Handle navigation requests (for offline page)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update cache with new content
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Serve cached page or offline page
          return caches.match(event.request)
            .then((response) => {
              return response || caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Handle API and asset requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('[SW] Serving from cache:', event.request.url);
          return response;
        }

        // Fetch from network and cache the response
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response to cache it
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });

            return response;
          })
          .catch((error) => {
            console.log('[SW] Network request failed:', error);
            
            // For HTML requests, serve offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return a generic offline response
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background sync for quiz submissions when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'quiz-submission') {
    console.log('[SW] Background sync: quiz-submission');
    event.waitUntil(
      // Handle pending quiz submissions
      syncQuizSubmissions()
    );
  }
});

// Handle quiz submissions that were queued while offline
async function syncQuizSubmissions() {
  try {
    // This would integrate with IndexedDB to sync pending submissions
    console.log('[SW] Syncing quiz submissions...');
    
    // Notify the main thread that sync is complete
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'QUIZ_SYNC_COMPLETE'
      });
    });
  } catch (error) {
    console.error('[SW] Quiz sync failed:', error);
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] FUNSHIKSHA Service Worker loaded successfully');