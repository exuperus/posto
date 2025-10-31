// Service Worker para PWA
const CACHE_NAME = 'sandrina-mario-v1';
const urlsToCache = [
  '/',
  '/combustiveis',
  '/produtos',
  '/contactos',
  '/servicos',
  '/transporte-domicilio',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// Instalção do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
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
    })
    .then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Estratégia: Network First, com fallback para Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache válido, retorna a resposta
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Se a rede falhar, busca no cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Se não encontrar no cache, retorna erro genérico
            return new Response('Offline - Conteúdo não disponível', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});







