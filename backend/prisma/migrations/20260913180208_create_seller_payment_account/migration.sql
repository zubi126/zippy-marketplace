-- CreateEnum
CREATE TYPE "SellerPaymentAccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateTable
CREATE TABLE "SellerPaymentAccount" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'razorpay',
    "linkedAccountId" TEXT NOT NULL,
    "status" "SellerPaymentAccountStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerPaymentAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellerPaymentAccount_shopId_key" ON "SellerPaymentAccount"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerPaymentAccount_linkedAccountId_key" ON "SellerPaymentAccount"("linkedAccountId");

-- AddForeignKey
ALTER TABLE "SellerPaymentAccount" ADD CONSTRAINT "SellerPaymentAccount_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
