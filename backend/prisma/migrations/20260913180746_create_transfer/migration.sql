-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED', 'REVERSED');

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "sellerPaymentAccountId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "provider" TEXT NOT NULL DEFAULT 'razorpay',
    "razorpayTransferId" TEXT,
    "status" "TransferStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_razorpayTransferId_key" ON "Transfer"("razorpayTransferId");

-- CreateIndex
CREATE INDEX "Transfer_orderId_idx" ON "Transfer"("orderId");

-- CreateIndex
CREATE INDEX "Transfer_shopId_idx" ON "Transfer"("shopId");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_sellerPaymentAccountId_fkey" FOREIGN KEY ("sellerPaymentAccountId") REFERENCES "SellerPaymentAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
