/*
  Warnings:

  - A unique constraint covering the columns `[buyerId,listingId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_sellerId_fkey`;

-- DropIndex
DROP INDEX `Review_sellerId_buyerId_key` ON `review`;

-- CreateIndex
CREATE UNIQUE INDEX `Review_buyerId_listingId_key` ON `Review`(`buyerId`, `listingId`);

