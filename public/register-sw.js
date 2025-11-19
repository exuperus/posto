// Registro automático do Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('[SW] Registered:', registration.scope);
        
        // Força verificação de atualização a cada hora
        setInterval(() => {
          registration.update();
        }, 3600000); // 1 hora
        
        // Verifica atualizações quando a página ganha foco
        window.addEventListener('focus', () => {
          registration.update();
        });
        
        // Verifica atualizações imediatamente
        registration.update();
        
        // Verifica atualizações quando encontradas
        registration.addEventListener('updatefound', () => {
          console.log('[SW] Update found');
          const newWorker = registration.installing;
          
          newWorker?.addEventListener('statechange', () => {
            if (newWorker?.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version available - reloading page');
              // Força reload para usar nova versão
              window.location.reload();
            }
          });
        });
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });
  });
}







