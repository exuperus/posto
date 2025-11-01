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
O endpoint `POST /api/admin/fuels/publish` publica todos os preços agendados cuja `vigencia_inicio` já passou.

### 3.1. Autenticação
- Envie o header `x-cron-secret: <CRON_SECRET>` na chamada.
- Sem esse header (ou se o valor estiver errado) o pedido é rejeitado com 401.

### 3.2. Exemplos de chamada
```bash
curl -X POST \
  -H "x-cron-secret: $CRON_SECRET" \
  https://seu-dominio.com/api/admin/fuels/publish
```

### 3.3. Agendadores sugeridos
- **GitHub Actions** (já incluído em `.github/workflows/publish-fuels.yml`):
  - Configure os secrets `PUBLISH_ENDPOINT` (ex.: `https://seu-dominio.com/api/admin/fuels/publish`) e `CRON_SECRET`.
  - O workflow corre a cada 5 minutos (`cron: "*/5 * * * *"`) e pode ser disparado manualmente via *workflow_dispatch*.
- **Vercel Cron**: crie um job diário/horário que faça o `POST` se hospedar na Vercel.
- **Windows Task Scheduler / cron do servidor**: executar script `curl` no horário pretendido caso hospede num servidor próprio.

O endpoint é idempotente: se não houver preços vencidos, devolve `{ ok: true, message: "Sem preços agendados" }`.

## 4. Execução manual (fallback)
Se preferir publicar manualmente, pode chamar o mesmo endpoint via `curl` ou Postman depois de confirmar que os preços devem entrar em vigor.

---

Com estes passos, consegue manter os preços agendados no fim de semana e garantir que entram em vigor automaticamente à segunda-feira (ou em qualquer outro horário definido).

