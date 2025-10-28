# 🧪 Guia de Teste do PWA

## ✅ Build Completo
- ✓ Build concluído sem erros
- ✓ Ícones criados (icon-192.png, icon-512.png)
- ✓ Manifest.json configurado
- ✓ Service Worker ativo
- ✓ Prompt de instalação adicionado

## 📱 Como Testar

### Opção 1: Testar no Telemóvel Localmente

1. **Ver o IP da sua máquina:**
   ```bash
   ipconfig
   # Procure por "IPv4 Address" (ex: 192.168.1.100)
   ```

2. **Iniciar servidor de desenvolvimento:**
   ```bash
   cd posto-web
   npm run dev
   ```

3. **No telemóvel, acesse:**
   ```
   http://[SEU-IP]:3000
   ```

4. **Espere 3 segundos** → Aparece um banner no canto inferior!

---

### Opção 2: Testar em Produção (Vercel)

1. **Fazer deploy:**
   ```bash
   # Se já tem Vercel configurado
   vercel deploy
   ```

2. **Aceder ao site no telemóvel** através do URL da Vercel

3. **Espere 3 segundos** → Aparece o banner de instalação!

---

## 📲 O Que Acontece?

### **iPhone (Safari):**
1. Abre o site
2. Após 3 seg, aparece um card no canto inferior:
   ```
   ⬇️ Instalar App
   Adicione à tela inicial para acesso rápido: 
   ⋮ Menu → Adicionar à Tela Inicial
   ```
3. Usuário toca no ícone de compartilhar ⬆️
4. Escolhe "Adicionar à Tela Inicial"
5. ✅ App instalado!

### **Android (Chrome):**
1. Abre o site
2. Chrome mostra banner automático: **"Adicionar à tela inicial"**
3. OU após 3 seg aparece o card personalizado
4. Usuário toca "Instalar Agora"
5. ✅ App instalado!

---

## 🎯 Funcionalidades PWA

Depois de instalado:

✓ **Funciona como app** (sem barra do navegador)  
✓ **Ícone na tela inicial** (igual apps nativos)  
✓ **Funciona offline** (cache de páginas visitadas)  
✓ **Atualiza automaticamente** (sem precisar ir à loja)  
✓ **Acesso rápido** (como app normal)

---

## 🐛 Debug

### Ver se PWA está ativo:
1. Abra DevTools (F12)
2. Vá à tab **Application**
3. Veja:
   - **Manifest** → Deve estar carregado
   - **Service Workers** → Deve estar "activated"
   - **Cache Storage** → Deve ter "sandrina-mario-v1"

### Testar offline:
1. Abra a app
2. Vá ao Chrome DevTools (F12)
3. **Application** → **Network** → Marque **"Offline"**
4. Recarregue a página
5. ✅ Deve aparecer conteúdo em cache!

---

## 📊 Lighthouse Score

Para verificar a qualidade do PWA:

1. Abra DevTools (F12)
2. Tab **Lighthouse**
3. Selecione **"Progressive Web App"**
4. Clique **"Generate report"**
5. Procure por score > 90

---

## ❓ Problemas Comuns

### "Ícones não aparecem"
- Verifique se `icon-192.png` e `icon-512.png` existem em `public/`
- Execute: `ls public/icon-*.png`

### "Banner não aparece"
- Se já instalou, o banner não aparece
- Desinstale: Long press no ícone → "Remover da Tela Inicial"
- Acesse novamente

### "Service Worker não funciona"
- Verifique console (F12) por erros
- Vá a Application → Service Workers → Clique "Unregister"
- Recarregue

---

## 🎉 Resultado Esperado

**Após instalar:**
- Ícone na tela inicial
- Abrir como app (sem navegador)
- Funciona offline
- Atualiza sozinho

**É isto que o PWA faz!** 🚀

---

## 💡 Próximos Passos (Opcional)

1. **Notificações Push** - Avise sobre novos preços
2. **Badge no ícone** - Mostrar número de atualizações
3. **Splash Screen** - Tela de carregamento personalizada
4. **Analytics** - Ver quantos instalaram


