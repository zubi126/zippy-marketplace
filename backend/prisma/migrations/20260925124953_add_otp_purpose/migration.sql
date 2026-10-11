/*
  Add OTP purpose safely while preserving existing OTP records
  and legacy Razorpay Payment columns.
*/

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM (
    'CUSTOMER_REGISTRATION',
    'SHOPKEEPER_REGISTRATION',
    'RIDER_REGISTRATION'
);

-- Add purpose as nullable first
ALTER TABLE "OtpVerification"
ADD COLUMN "purpose" "OtpPurpose";

-- Existing OTP records belong to the old customer-oriented OTP flow
UPDATE "OtpVerification"
SET "purpose" = 'CUSTOMER_REGISTRATION'
WHERE "purpose" IS NULL;

-- Make purpose required after backfilling existing rows
ALTER TABLE "OtpVerification"
ALTER COLUMN "purpose" SET NOT NULL;

-- CreateIndex
CREATE INDEX "OtpVerification_purpose_idx"
ON "OtpVerification"("purpose");