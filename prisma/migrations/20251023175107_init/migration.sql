-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('GASOLEO', 'GASOLEO_HI_ENERGY', 'GASOLINA_95', 'GASOLEO_AGRICOLA');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('LUBRIFICANTES', 'ADITIVOS', 'LAVAGEM', 'ACESSORIOS', 'OUTROS');

-- CreateTable
CREATE TABLE "Station" (
    "id" SERIAL NOT NULL,
    "nome_comercial" TEXT NOT NULL,
    "morada" TEXT NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "localidade" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "telefone" TEXT,
    "email" TEXT,
    "horario_semana" TEXT,
    "horario_fim_semana" TEXT,
    "feriados_especiais" TEXT,
    "servicosJson" TEXT,
    "linksJson" TEXT,
    "logoUrl" TEXT,
    "heroUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fuel" (
    "id" SERIAL NOT NULL,
    "tipo" "FuelType" NOT NULL,
    "preco_atual" DECIMAL(65,30) NOT NULL,
    "vigencia_inicio" TIMESTAMP(3) NOT NULL,
    "preco_anterior" DECIMAL(65,30),
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fuel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "Category" NOT NULL,
    "precoCents" INTEGER,
    "descricao" TEXT DEFAULT '',
    "imagemUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_categoria_nome_idx" ON "Product"("categoria", "nome");
