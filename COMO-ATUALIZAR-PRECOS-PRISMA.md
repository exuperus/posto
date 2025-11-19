# Como Atualizar Preços Manualmente no Prisma Studio

## ⚠️ Importante: Regras para Atualizar Preços

Para que os preços apareçam no site e na página admin, você precisa seguir estas regras:

### 1. **Apenas UM registro por tipo deve estar publicado**

Cada tipo de combustível (GASOLEO, GASOLEO_HI_ENERGY, GASOLINA_95, GASOLEO_AGRICOLA) deve ter **apenas UM** registro com `publicado = true`.

## 📝 Passo a Passo no Prisma Studio

### Opção A: Atualizar Registro Existente (Recomendado)

1. **Abra o Prisma Studio:**
   ```bash
   cd posto-web
   npx prisma studio
   ```

2. **Vá para a tabela `Fuel`**

3. **Para cada tipo de combustível que quer atualizar:**
   - Encontre o registro com `publicado = true` para aquele tipo
   - Clique nele para editar
   - Atualize os campos:
     - `preco_atual`: Novo preço (ex: 1.580)
     - `preco_anterior`: Preço anterior (opcional, pode deixar null)
     - `vigencia_inicio`: Data/hora de quando o preço entra em vigor
       - Para publicar imediatamente: Use data/hora atual ou passada
       - Para agendar: Use data/hora futura
     - `publicado`: **DEVE estar como `true`** para aparecer no site
   - Salve

### Opção B: Criar Novo Registro (Arquivar o Anterior)

Se quiser criar um novo registro (mantendo histórico):

1. **Primeiro, arquive o registro atual:**
   - Encontre o registro com `publicado = true` do tipo
   - Mude `publicado` para `false`
   - Salve

2. **Depois, crie o novo registro:**
   - Clique em "Add record"
   - Preencha:
     - `tipo`: Selecione o tipo (GASOLEO, GASOLEO_HI_ENERGY, etc.)
     - `preco_atual`: Novo preço (ex: 1.580)
     - `preco_anterior`: Preço do registro anterior (opcional)
     - `vigencia_inicio`: Data/hora (use data atual para publicar agora)
     - `publicado`: **MUST be `true`**
   - Salve

## ✅ Checklist Antes de Salvar

Para cada tipo de combustível que atualizar, certifique-se:

- [ ] `publicado = true` (caso contrário não aparece no site)
- [ ] `vigencia_inicio` está no passado ou presente (para publicar agora)
- [ ] `preco_atual` tem um valor válido (não null, não zero)
- [ ] Apenas UM registro desse tipo tem `publicado = true`
- [ ] Os outros registros do mesmo tipo têm `publicado = false`

## 🔍 Como Verificar se Está Correto

### No Prisma Studio:

Execute esta query para ver todos os combustíveis publicados:
```
Fuel WHERE publicado = true
```

Você deve ver **exatamente 4 registros** (um de cada tipo):
- Um com `tipo = GASOLEO`
- Um com `tipo = GASOLEO_HI_ENERGY`
- Um com `tipo = GASOLINA_95`
- Um com `tipo = GASOLEO_AGRICOLA`

### Via Script:

Execute o script de verificação:
```bash
cd posto-web
node scripts/check-fuels-status.mjs
```

Este script mostra:
- Quais combustíveis estão publicados
- Quantos registros não publicados existem
- Status de cada tipo

## 🚨 Problemas Comuns e Soluções

### Problema 1: Preço não aparece no site
**Causa**: `publicado = false` ou múltiplos registros publicados
**Solução**: 
- Verifique que apenas 1 registro tem `publicado = true`
- Mude os outros para `publicado = false`

### Problema 2: Gasóleo Agrícola não aparece
**Causa**: Registro não existe ou não está publicado
**Solução**:
- Verifique se existe um registro com `tipo = GASOLEO_AGRICOLA`
- Se não existir, crie um novo
- Certifique-se que `publicado = true`

### Problema 3: Preço atualizado mas não muda no site
**Causa**: Cache do navegador ou múltiplos registros
**Solução**:
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Verifique que apenas 1 registro está publicado por tipo
- Recarregue a página com Ctrl+Shift+R

## 📊 Estrutura Correta no Banco

```
Fuel table:
├── ID 1: GASOLEO, publicado=true, preco_atual=1.580
├── ID 2: GASOLEO_HI_ENERGY, publicado=true, preco_atual=1.650
├── ID 3: GASOLINA_95, publicado=true, preco_atual=1.780
└── ID 4: GASOLEO_AGRICOLA, publicado=true, preco_atual=1.200

Todos os outros registros devem ter publicado=false
```

## 💡 Dica Pro

Se quiser manter histórico completo:
1. Antes de criar novo registro, mude o atual para `publicado = false`
2. Crie novo registro com `publicado = true`
3. Copie o `preco_atual` do registro antigo para o `preco_anterior` do novo

Isso mantém o histórico de preços anteriores funcionando.


