-- CreateEnum
CREATE TYPE "RiderVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "verificationStatus" "RiderVerificationStatus" NOT NULL DEFAULT 'PENDING';
