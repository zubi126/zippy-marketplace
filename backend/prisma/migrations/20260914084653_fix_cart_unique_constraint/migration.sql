-- Drop old unique constraint
DROP INDEX "Cart_customerId_shopId_status_key";

-- Create normal index
CREATE INDEX "Cart_customerId_shopId_status_idx"
ON "Cart"("customerId", "shopId", "status");

-- Allow only one ACTIVE cart per customer per shop
CREATE UNIQUE INDEX "Cart_customerId_shopId_active_key"
ON "Cart"("customerId", "shopId")
WHERE "status" = 'ACTIVE';