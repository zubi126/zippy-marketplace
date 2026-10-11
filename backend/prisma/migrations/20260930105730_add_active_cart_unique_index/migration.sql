CREATE UNIQUE INDEX "Cart_one_active_per_customer_shop"
ON "Cart" ("customerId", "shopId")
WHERE "status" = 'ACTIVE';