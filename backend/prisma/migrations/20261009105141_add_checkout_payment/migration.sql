-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "checkoutPaymentId" TEXT;

-- CreateTable
CREATE TABLE "CheckoutPayment" (
    "id" TEXT NOT NULL,
    "checkoutNumber" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "method" "PaymentMethod" NOT NULL,
    "provider" TEXT,
    "providerOrderId" TEXT,
    "providerPaymentId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "refundedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "refundedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckoutPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutPayment_checkoutNumber_key" ON "CheckoutPayment"("checkoutNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutPayment_providerOrderId_key" ON "CheckoutPayment"("providerOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutPayment_providerPaymentId_key" ON "CheckoutPayment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "CheckoutPayment_customerId_idx" ON "CheckoutPayment"("customerId");

-- CreateIndex
CREATE INDEX "CheckoutPayment_status_idx" ON "CheckoutPayment"("status");

-- CreateIndex
CREATE INDEX "CheckoutPayment_method_idx" ON "CheckoutPayment"("method");

-- CreateIndex
CREATE INDEX "CheckoutPayment_createdAt_idx" ON "CheckoutPayment"("createdAt");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_checkoutPaymentId_fkey" FOREIGN KEY ("checkoutPaymentId") REFERENCES "CheckoutPayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutPayment" ADD CONSTRAINT "CheckoutPayment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
