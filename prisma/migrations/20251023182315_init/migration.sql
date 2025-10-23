/*
  Warnings:

  - You are about to alter the column `preco_atual` on the `Fuel` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.
  - You are about to alter the column `preco_anterior` on the `Fuel` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE "Fuel" ALTER COLUMN "preco_atual" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "preco_anterior" SET DATA TYPE DECIMAL(10,3);

-- CreateIndex
CREATE INDEX "Fuel_tipo_publicado_vigencia_inicio_idx" ON "Fuel"("tipo", "publicado", "vigencia_inicio");

-- CreateIndex
CREATE INDEX "Product_ativo_categoria_idx" ON "Product"("ativo", "categoria");
