-- AlterTable
ALTER TABLE "OtpVerification" ADD COLUMN     "consumedAt" TIMESTAMP(3),
ADD COLUMN     "invalidatedAt" TIMESTAMP(3);
