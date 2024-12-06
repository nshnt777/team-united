-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address1" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "age" DROP NOT NULL;
