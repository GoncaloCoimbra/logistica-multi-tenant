-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "Transport" ADD COLUMN     "departureDate" TIMESTAMP(3),
ADD COLUMN     "estimatedArrival" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "totalWeight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "model" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'available';
