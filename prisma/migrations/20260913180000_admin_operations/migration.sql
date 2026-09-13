-- CreateEnum
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StockMovementType') THEN CREATE TYPE "StockMovementType" AS ENUM ('INITIAL', 'RESTOCK', 'CORRECTION', 'ORDER_CONFIRMED', 'RETURN', 'OTHER'); END IF; END $$;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingCarrier" TEXT,
ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT,
ADD COLUMN IF NOT EXISTS "shippedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "deliveredAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE IF NOT EXISTS "StockMovement" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "quantityDelta" INTEGER NOT NULL,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "actorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StockMovement_bookId_fkey') THEN ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StockMovement_actorUserId_fkey') THEN ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$;
