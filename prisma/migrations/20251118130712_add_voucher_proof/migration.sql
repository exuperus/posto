-- CreateTable
CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "valorAbastecimento" DECIMAL(10,2),
    "numeroRecibo" TEXT,
    "fotoReciboUrl" TEXT,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "usadoEm" TIMESTAMP(3),
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_codigo_key" ON "Voucher"("codigo");

-- CreateIndex
CREATE INDEX "Voucher_codigo_idx" ON "Voucher"("codigo");

-- CreateIndex
CREATE INDEX "Voucher_deviceId_criadoEm_idx" ON "Voucher"("deviceId", "criadoEm");

-- CreateIndex
CREATE INDEX "Voucher_usado_expiraEm_idx" ON "Voucher"("usado", "expiraEm");

-- CreateIndex
CREATE INDEX "Voucher_numeroRecibo_idx" ON "Voucher"("numeroRecibo");
