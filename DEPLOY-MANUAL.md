# Como Reativar Deploy Automático no Vercel

Se o deploy automático parou de funcionar após push para GitHub, siga estes passos:

## 1. Verificar Conexão Git no Vercel

1. Acesse o painel do Vercel: https://vercel.com/dashboard
2. Selecione o projeto `posto` (ou o nome do seu projeto)
3. Vá em **Settings** → **Git**
4. Verifique se há uma conexão ativa com o repositório GitHub

## 2. Reconectar Repositório (se necessário)

1. Em **Settings** → **Git**, clique em **Disconnect** (se houver uma conexão quebrada)
2. Clique em **Connect Git Repository**
3. Selecione o repositório `exuperus/posto`
4. Escolha a branch `main` para Production
5. Configure:
   - **Production Branch**: `main`
   - **Root Directory**: `posto-web` (se o projeto Next.js está nesta pasta)
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build` (ou `npm run build`)
   - **Output Directory**: `.next` (ou deixar padrão)

## 3. Verificar Webhooks do GitHub

1. No GitHub, vá para: `https://github.com/exuperus/posto/settings/hooks`
2. Verifique se há um webhook do Vercel configurado
3. Se não houver, o Vercel cria automaticamente ao reconectar

## 4. Forçar Deploy Manual (Alternativa Rápida)

Se precisar fazer deploy imediatamente:

### Opção A: Via Painel Vercel
1. No dashboard do Vercel, clique no projeto
2. Clique no menu "..." ao lado do último deploy
3. Selecione **Redeploy**
4. Ou clique em **Deploy** → **Create Deployment**

### Opção B: Via CLI
```bash
cd posto-web
npx vercel --prod
```

## 5. Verificar Build Settings

Em **Settings** → **General** → **Build & Development Settings**:

- **Build Command**: `pnpm build` (ou o que está no package.json)
- **Output Directory**: `.next` (deixe padrão para Next.js)
- **Install Command**: `pnpm install` (ou `npm install`)
- **Development Command**: `pnpm dev`

## 6. Verificar Variáveis de Ambiente

Em **Settings** → **Environment Variables**, certifique-se de que estão configuradas:
- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_KEY`
- `CRON_SECRET` (se usado)

## Root Directory Importante!

Se o Next.js está em `posto-web/`, configure:
- **Root Directory**: `posto-web`

Ou ajuste o `vercel.json` para apontar corretamente.

---

**Nota**: Após reconectar, o próximo push para `main` deve acionar deploy automático.

