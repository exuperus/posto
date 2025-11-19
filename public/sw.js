// Service Worker para PWA
// Atualizar a versão quando houver mudanças importantes para forçar atualização
const CACHE_NAME = 'sandrina-mario-v3';
// Apenas cachear assets estáticos, NÃO páginas HTML
const urlsToCache = [
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

// Estratégia: Network First para HTML, Cache First para assets estáticos
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isHTML = event.request.headers.get('accept')?.includes('text/html');
  const isStaticAsset = url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i);
  
  // Para páginas HTML: SEMPRE buscar da rede primeiro (nunca cachear HTML)
  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Retorna sempre a versão mais recente da rede
          return response;
        })
        .catch(() => {
          // Se offline, tenta buscar do cache como último recurso
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return new Response('Offline - Conteúdo não disponível', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
    return;
  }
  
  // Para assets estáticos: Cache First (mais rápido)
  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((response) => {
            // Cachear apenas se for sucesso
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }
  
  // Para outros recursos: Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response('Offline - Conteúdo não disponível', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});







