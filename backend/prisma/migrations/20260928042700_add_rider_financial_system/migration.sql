-- CreateEnum
CREATE TYPE "RiderPayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RiderLedgerEntryType" AS ENUM ('EARNING', 'PAYOUT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "RiderLedgerEntryDirection" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "RiderPayout" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "RiderPayoutStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerPayoutId" TEXT,
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "referenceId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderPayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderLedgerEntry" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "deliveryId" TEXT,
    "payoutId" TEXT,
    "type" "RiderLedgerEntryType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "direction" "RiderLedgerEntryDirection" NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiderLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RiderPayout_idempotencyKey_key" ON "RiderPayout"("idempotencyKey");

-- CreateIndex
CREATE INDEX "RiderPayout_riderId_idx" ON "RiderPayout"("riderId");

-- CreateIndex
CREATE INDEX "RiderPayout_status_idx" ON "RiderPayout"("status");

-- CreateIndex
CREATE INDEX "RiderPayout_periodStart_periodEnd_idx" ON "RiderPayout"("periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "RiderPayout_createdAt_idx" ON "RiderPayout"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RiderLedgerEntry_idempotencyKey_key" ON "RiderLedgerEntry"("idempotencyKey");

-- CreateIndex
CREATE INDEX "RiderLedgerEntry_riderId_idx" ON "RiderLedgerEntry"("riderId");

-- CreateIndex
CREATE INDEX "RiderLedgerEntry_deliveryId_idx" ON "RiderLedgerEntry"("deliveryId");

-- CreateIndex
CREATE INDEX "RiderLedgerEntry_payoutId_idx" ON "RiderLedgerEntry"("payoutId");

-- CreateIndex
CREATE INDEX "RiderLedgerEntry_type_idx" ON "RiderLedgerEntry"("type");

-- CreateIndex
CREATE INDEX "RiderLedgerEntry_createdAt_idx" ON "RiderLedgerEntry"("createdAt");

-- AddForeignKey
ALTER TABLE "RiderPayout" ADD CONSTRAINT "RiderPayout_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderLedgerEntry" ADD CONSTRAINT "RiderLedgerEntry_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderLedgerEntry" ADD CONSTRAINT "RiderLedgerEntry_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderLedgerEntry" ADD CONSTRAINT "RiderLedgerEntry_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "RiderPayout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
