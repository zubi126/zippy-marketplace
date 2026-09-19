-- CreateEnum
CREATE TYPE "ShopVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "verificationStatus" "ShopVerificationStatus" NOT NULL DEFAULT 'PENDING';
