# Agendamento de preços dos combustíveis

## 1. Preparação
- Defina a variável de ambiente `CRON_SECRET` (pode reutilizar a `ADMIN_KEY`, mas recomenda-se um valor exclusivo).
- Desdobre a aplicação após definir a variável para que o `route handler` tenha acesso.

## 2. Agendar através do painel
1. Entre em `/admin/login` e autentique-se com a `ADMIN_KEY`.
2. Aceda a `/admin/precos`.
3. Introduza os novos preços.
4. Escolha a *Vigência (data)* e *Hora* desejadas.
   - Se a data/hora forem no futuro, o sistema cria o registo com `publicado = false`.
   - Se a data/hora forem passadas ou vazias, o preço entra em vigor imediatamente.
5. Clique em **Guardar preços**.

## 3. Publicar automaticamente quando chegar a hora
O endpoint `GET /api/admin/fuels/publish` publica todos os preços agendados cuja `vigencia_inicio` já passou.

### 3.1. Autenticação

#### Em Produção (Vercel)
- **Automática**: O Vercel Cron job configura-se automaticamente no `vercel.json`
- A autenticação é feita automaticamente para requisições GET em produção
- Não é necessário configurar headers especiais

#### Em Desenvolvimento Local ou Chamadas POST
- Envie o header `x-cron-secret: <CRON_SECRET>` na chamada
- Ou use `Authorization: Bearer <CRON_SECRET>`
- Sem autenticação, o pedido é rejeitado com 401

### 3.2. Configuração Vercel Cron
Já está configurado no `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/admin/fuels/publish",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

O cron roda automaticamente a cada 5 minutos e publica preços agendados.

### 3.3. Teste Manual
Para testar localmente ou na produção:

```bash
# Usando o script de teste
node scripts/test-publish-fuels.mjs http://localhost:3000 sua-admin-key

# Ou usando curl
curl -X POST \
  -H "x-cron-secret: $CRON_SECRET" \
  https://seu-dominio.com/api/admin/fuels/publish

# GET funciona em produção Vercel sem autenticação
curl https://seu-dominio.com/api/admin/fuels/publish
```

### 3.4. Alternativas
- **GitHub Actions**: Configure workflow para fazer POST com `x-cron-secret`
- **Windows Task Scheduler / cron do servidor**: Execute o script `test-publish-fuels.mjs`

O endpoint é idempotente: se não houver preços vencidos, devolve `{ ok: true, message: "Sem preços agendados" }`.

## 4. Execução manual (fallback)
Se preferir publicar manualmente, pode chamar o mesmo endpoint via `curl` ou Postman depois de confirmar que os preços devem entrar em vigor.

---

Com estes passos, consegue manter os preços agendados no fim de semana e garantir que entram em vigor automaticamente à segunda-feira (ou em qualquer outro horário definido).

