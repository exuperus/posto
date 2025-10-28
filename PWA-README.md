# 📱 PWA - Progressive Web App

O seu site agora é uma **Progressive Web App (PWA)**! Isto significa que os utilizadores podem instalá-lo no telemóvel como uma aplicação normal.

## ✅ O que já está configurado

1. **manifest.json** - Define como a app aparece quando instalada
2. **Service Worker** - Permite funcionar offline
3. **Ícones** - Necessários para a instalação
4. **Metadata** - Configuração para iOS e Android

## 🎨 Como criar os ícones

Os ícones ainda precisam de ser criados. Siga estes passos:

### Opção 1: Automática (Recomendado)

1. **Crie uma imagem base:**
   - Tamanho: 512x512 pixels
   - Formato: PNG com fundo transparente
   - Nome: `icon-base.png`
   - Localização: `public/icon-base.png`

2. **Instale as ferramentas:**
   ```bash
   cd posto-web
   npm install sharp --save-dev
   ```

3. **Gere os ícones:**
   ```bash
   node scripts/generate-pwa-icons.js
   ```

### Opção 2: Manual

Crie manualmente os ficheiros:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

## 📲 Como instalar no telemóvel

### Android (Chrome)

1. Abra o site no Chrome
2. Toque no menu (⋮) → **"Adicionar à tela inicial"** ou **"Instalar app"**
3. Confirme a instalação

### iOS (Safari)

1. Abra o site no Safari
2. Toque no botão **Compartilhar** (⬆️)
3. Selecione **"Adicionar à Tela Inicial"**
4. Toque em **"Adicionar"**

### Desktop (Chrome/Edge)

1. Abra o site no Chrome ou Edge
2. Procure o ícone de instalação na barra de endereços (⊕)
3. Clique em **"Instalar"**

## 🎯 Vantagens de usar PWA vs App Nativa

### ✅ Vantagens do PWA
- ✅ **Grátis** - Sem taxas de publicação
- ✅ **Instantâneo** - Atualiza automaticamente
- ✅ **Universal** - Funciona em todos os dispositivos
- ✅ **Sem lojas** - Não precisa de App Store/Google Play
- ✅ **Offline** - Funciona sem internet (cache)
- ✅ **Fácil manutenção** - Atualiza como um site

### ❌ Desvantagens de App Nativa
- ❌ **Taxas anuais** (~100€/ano por plataforma)
- ❌ **Processo de aprovação** (pode levar semanas)
- ❌ **Atualizações lentas** (requer aprovação)
- ❌ **Código diferente** para iOS e Android
- ❌ **Mais complexo** de desenvolver

## 🔄 Como funciona offline?

O Service Worker guarda uma cópia das páginas visitadas. Quando não há internet:

1. **Cache disponível** → Mostra a versão em cache
2. **Sem cache** → Mostra mensagem "Offline"

## 🚀 Próximos passos (Opcional)

### 1. Notificações Push
Para enviar notificações aos utilizadores (ex: preços novos):

```javascript
// Exemplo de notificação
navigator.serviceWorker.ready.then((registration) => {
  registration.showNotification('Nova atualização!', {
    body: 'Preços de combustível atualizados',
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  });
});
```

### 2. Atualização Automática
O site já detecta atualizações automaticamente. Para forçar atualização:

```javascript
// Reinicia a app para atualizar cache
window.location.reload();
```

## 📊 Testar PWA

### DevTools Chrome
1. F12 → **Application** tab
2. Veja **Manifest** - confirma configuração
3. Veja **Service Workers** - verifica registo
4. Veja **Cache Storage** - vê o que está guardado

### Lighthouse
1. F12 → **Lighthouse** tab
2. Selecione **Progressive Web App**
3. Clique em **Generate report**
4. Score: **>90** = Excelente PWA!

## ❓ FAQ

**P: Precisa de HTTPS para PWA?**  
R: Sim! PWA só funciona em HTTPS (ou localhost em desenvolvimento).

**P: Posso publicar no App Store?**  
R: Sim! Pode usar ferramentas como [Capacitor](https://capacitorjs.com/) ou [Ionic](https://ionicframework.com/) para converter PWA em app nativa.

**P: Funciona em todos os browsers?**  
R: Sim! Chrome, Edge, Safari (iOS 11+), Firefox, Samsung Internet.

## 📝 Notas

- O PWA é compatível com o site atual
- Não afeta o funcionamento normal
- Melhora a experiência no móvel
- Aumenta o tempo de uso (estatisticamente 70% mais)

---

**Conclusão:** PWA é a escolha mais inteligente para o seu negócio! 💪


