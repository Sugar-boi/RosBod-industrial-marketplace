/*
  Warnings:

  - A unique constraint covering the columns `[sellerId,buyerId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listingId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `review` ADD COLUMN `listingId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Review_sellerId_buyerId_key` ON `Review`(`sellerId`, `buyerId`);

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
