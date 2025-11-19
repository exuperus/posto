# 🧪 Guia de Teste - Sistema de Vouchers

## ✅ Pré-requisitos

1. **Base de dados configurada** - A migration já foi aplicada ✓
2. **Diretório de uploads criado** - `public/uploads/vouchers/` ✓
3. **Variáveis de ambiente** - `.env` com `DATABASE_URL` e `ADMIN_KEY`

---

## 🚀 Como Testar Localmente

### 1. Iniciar o Servidor de Desenvolvimento

```bash
cd posto-web
pnpm dev
```

O servidor vai iniciar em: **http://localhost:3000**

---

## 📋 Fluxo de Teste Completo

### **Teste 1: Cliente Gera Voucher (com foto)**

1. **Abrir no navegador:**
   ```
   http://localhost:3000/promocoes
   ```

2. **Preencher formulário:**
   - Valor: `55.00` (ou qualquer valor ≥ 50€)
   - Anexar foto do recibo (ou inserir número do recibo)
   - Clicar em "Gerar Voucher"

3. **Resultado esperado:**
   - ✅ Voucher gerado com código tipo `LAV-XXX-YYY`
   - ✅ Código exibido na tela
   - ✅ Data de expiração (1 mês)

---

### **Teste 2: Ver Histórico de Vouchers**

1. **Abrir:**
   ```
   http://localhost:3000/promocoes/meus-vouchers
   ```

2. **Resultado esperado:**
   - ✅ Lista de vouchers gerados
   - ✅ Status (Válido, Usado, Expirado)
   - ✅ Informações de cada voucher

---

### **Teste 3: Admin Valida Voucher**

1. **Fazer login admin:**
   ```
   http://localhost:3000/admin/login
   ```
   - Inserir `ADMIN_KEY` (do `.env`)

2. **Abrir página de validação:**
   ```
   http://localhost:3000/admin/vouchers
   ```

3. **Validar voucher:**
   - Digitar código do voucher (ex: `LAV-ABC-123`)
   - Clicar em "VALIDAR"

4. **Resultado esperado:**
   - ✅ Voucher válido → mensagem verde
   - ✅ Mostra foto do recibo (se anexada)
   - ✅ Mostra número do recibo (se inserido)
   - ✅ Voucher marcado como usado

---

### **Teste 4: Tentar Validar Voucher Já Usado**

1. **Tentar validar o mesmo código novamente**
2. **Resultado esperado:**
   - ❌ Mensagem: "Voucher já foi utilizado"
   - ✅ Mostra quando foi usado

---

### **Teste 5: Validações de Segurança**

#### Teste 5.1: Gerar voucher sem prova
- Tentar gerar sem foto e sem número do recibo
- **Resultado esperado:** ❌ Erro "É obrigatório anexar foto do recibo ou inserir número do recibo"

#### Teste 5.2: Valor menor que 50€
- Tentar gerar com valor `40.00`
- **Resultado esperado:** ❌ Erro "O valor mínimo é 50€ para gerar um voucher"

#### Teste 5.3: Voucher expirado
- Criar voucher e alterar data de expiração manualmente na BD (para testar)
- **Resultado esperado:** ❌ Erro "Voucher expirado"

---

## 🔍 Verificar no Banco de Dados (Opcional)

Se quiser ver os vouchers diretamente na base de dados:

```bash
cd posto-web
npx prisma studio
```

Abre em: **http://localhost:5555**

- Ver tabela `Voucher`
- Verificar campos: `codigo`, `numeroRecibo`, `fotoReciboUrl`, `usado`, etc.

---

## 🐛 Problemas Comuns

### **Erro: "Cannot find module '@prisma/client'"**
```bash
cd posto-web
pnpm install
npx prisma generate
```

### **Erro: "Table 'Voucher' does not exist"**
```bash
cd posto-web
npx prisma migrate dev
```

### **Erro ao fazer upload de foto**
- Verificar se o diretório `public/uploads/vouchers/` existe
- Verificar permissões de escrita

### **Erro: "Acesso não autorizado" no admin**
- Verificar se `ADMIN_KEY` está definida no `.env`
- Fazer login novamente em `/admin/login`

---

## 📝 Checklist de Teste

- [ ] Cliente consegue gerar voucher com foto
- [ ] Cliente consegue gerar voucher com número do recibo
- [ ] Cliente não consegue gerar sem prova (foto ou número)
- [ ] Cliente não consegue gerar com valor < 50€
- [ ] Histórico de vouchers funciona
- [ ] Admin consegue validar voucher
- [ ] Admin vê foto do recibo ao validar
- [ ] Admin vê número do recibo ao validar
- [ ] Voucher não pode ser usado duas vezes
- [ ] Voucher expirado não pode ser usado

---

## 🎯 URLs Importantes

- **Promoções:** http://localhost:3000/promocoes
- **Meus Vouchers:** http://localhost:3000/promocoes/meus-vouchers
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Vouchers:** http://localhost:3000/admin/vouchers
- **Prisma Studio:** http://localhost:5555 (após `npx prisma studio`)

---

## 💡 Dicas

1. **Testar em modo anónimo/privado** para simular diferentes dispositivos
2. **Usar DevTools** (F12) para ver erros no console
3. **Verificar Network tab** para ver requisições da API
4. **Limpar localStorage** se quiser testar como novo cliente

---

Boa sorte com os testes! 🚀


