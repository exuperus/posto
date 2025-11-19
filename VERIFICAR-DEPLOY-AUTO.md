# Por que o Deploy Automático Não Funciona?

O `vercel.json` só configura crons - **não controla deploy automático**. O deploy automático é configurado no **painel do Vercel**.

## ⚠️ Problema Mais Comum: Root Directory

Se o seu projeto Next.js está em `posto-web/` mas o repositório é a raiz (`posto/`), o Vercel precisa saber onde está o projeto.

## 🔧 Como Corrigir no Painel Vercel:

### 1. Acesse o Dashboard
- https://vercel.com/dashboard
- Selecione o projeto

### 2. Vá em Settings → General
- Role até **Root Directory**
- Se estiver vazio ou incorreto, configure:
  - **Root Directory**: `posto-web`

### 3. Verifique Git Integration
- Vá em **Settings → Git**
- Verifique se há uma conexão ativa com `exuperus/posto`
- Se não houver ou estiver quebrada:
  - Clique em **Disconnect** (se houver)
  - Clique em **Connect Git Repository**
  - Escolha o repositório `exuperus/posto`
  - **IMPORTANTE**: Configure **Root Directory** como `posto-web`

### 4. Verifique Branch Configuration
- Em **Settings → Git**
- **Production Branch**: deve ser `main`
- **Root Directory**: deve ser `posto-web` (se o projeto está nesta pasta)

### 5. Teste o Webhook
- No GitHub: `https://github.com/exuperus/posto/settings/hooks`
- Verifique se há um webhook do Vercel
- Se não houver, o Vercel cria ao reconectar

### 6. Build Settings (Settings → General)
- **Build Command**: `pnpm build` (ou deixe padrão - Next.js detecta automaticamente)
- **Output Directory**: `.next` (padrão para Next.js)
- **Install Command**: `pnpm install` (ou deixe padrão)
- **Root Directory**: `posto-web` ⚠️ **IMPORTANTE**

## 📝 Checklist:

- [ ] Root Directory está configurado como `posto-web`?
- [ ] Git Integration está conectada e ativa?
- [ ] Production Branch está configurada como `main`?
- [ ] Webhook do GitHub está configurado?
- [ ] Build Settings estão corretos?

## 🚀 Alternativa Rápida: Deploy Manual

Se precisar fazer deploy agora mesmo:

```bash
cd posto-web
npx vercel --prod
```

Ou no painel do Vercel:
- Clique no projeto
- Clique em **Deploy** → **Create Deployment**
- Escolha a branch `main`

---

**Nota**: Após configurar o Root Directory corretamente, o próximo push deve acionar deploy automático.

