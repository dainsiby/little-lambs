/*
  Warnings:

  - You are about to drop the column `recipientName` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `subtotalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `recipientName` on the `OrderAddressSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `lineTotal` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitPriceSnapshot` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `expectedAmount` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPaise` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalPaise` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPaise` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `OrderAddressSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineTotalPaise` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPricePaise` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedAmountPaise` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "recipientName",
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'India',
ADD COLUMN     "fullName" TEXT NOT NULL,
ALTER COLUMN "district" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "price",
ADD COLUMN     "pricePaise" INTEGER NOT NULL DEFAULT 10000;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingAmount",
DROP COLUMN "subtotalAmount",
DROP COLUMN "totalAmount",
ADD COLUMN     "shippingPaise" INTEGER NOT NULL,
ADD COLUMN     "subtotalPaise" INTEGER NOT NULL,
ADD COLUMN     "totalPaise" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderAddressSnapshot" DROP COLUMN "recipientName",
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'India',
ADD COLUMN     "fullName" TEXT NOT NULL,
ALTER COLUMN "district" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "lineTotal",
DROP COLUMN "unitPriceSnapshot",
ADD COLUMN     "lineTotalPaise" INTEGER NOT NULL,
ADD COLUMN     "unitPricePaise" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN     "usedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "expectedAmount",
ADD COLUMN     "expectedAmountPaise" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Book_featured_status_idx" ON "Book"("featured", "status");

-- CreateIndex
CREATE INDEX "Book_status_title_idx" ON "Book"("status", "title");

-- CreateIndex
CREATE INDEX "Order_userId_paymentStatus_placedAt_idx" ON "Order"("userId", "paymentStatus", "placedAt");

-- CreateIndex
CREATE INDEX "Order_fulfilmentStatus_placedAt_idx" ON "Order"("fulfilmentStatus", "placedAt");

-- CreateIndex
CREATE INDEX "Payment_orderId_status_idx" ON "Payment"("orderId", "status");

-- CreateIndex
CREATE INDEX "StockMovement_bookId_createdAt_idx" ON "StockMovement"("bookId", "createdAt");
