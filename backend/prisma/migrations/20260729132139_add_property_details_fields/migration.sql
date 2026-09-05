/*
  Warnings:

  - You are about to drop the column `processed` on the `auction` table. All the data in the column will be lost.
  - You are about to drop the column `hoursWorked` on the `equipmentdetails` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `equipmentdetails` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `auction` DROP COLUMN `processed`,
    ADD COLUMN `buyNowPrice` DOUBLE NULL,
    ADD COLUMN `inspectionAddress` VARCHAR(191) NULL,
    ADD COLUMN `inspectionCity` VARCHAR(191) NULL,
    ADD COLUMN `inspectionDate` DATETIME(3) NULL,
    ADD COLUMN `inspectionState` VARCHAR(191) NULL,
    ADD COLUMN `minimumIncrement` DOUBLE NOT NULL DEFAULT 1000,
    ADD COLUMN `paymentTerms` TEXT NULL,
    ADD COLUMN `reservePrice` DOUBLE NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `status` ENUM('SCHEDULED', 'LIVE', 'ENDED', 'SOLD', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    ADD COLUMN `terms` TEXT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `winnerId` INTEGER NULL;

-- AlterTable
ALTER TABLE `equipmentdetails` DROP COLUMN `hoursWorked`,
    DROP COLUMN `manufacturer`,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    ADD COLUMN `bucketCapacity` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `condition` VARCHAR(191) NULL,
    ADD COLUMN `operatingHours` INTEGER NULL,
    ADD COLUMN `serialNumber` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `propertydetails` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `factorySize` DOUBLE NULL,
    ADD COLUMN `floors` INTEGER NULL,
    ADD COLUMN `officeSpace` BOOLEAN NULL,
    ADD COLUMN `parkingSpaces` INTEGER NULL,
    ADD COLUMN `plotUnit` VARCHAR(191) NULL,
    ADD COLUMN `powerSupply` VARCHAR(191) NULL,
    ADD COLUMN `roadAccess` BOOLEAN NULL,
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `warehouseSize` DOUBLE NULL;

-- AlterTable
ALTER TABLE `quarrydetails` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SparePartDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listingId` INTEGER NOT NULL,
    `partName` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `partNumber` VARCHAR(191) NULL,
    `condition` VARCHAR(191) NULL,
    `quantity` INTEGER NULL,
    `state` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,

    UNIQUE INDEX `SparePartDetails_listingId_key`(`listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_winnerId_fkey` FOREIGN KEY (`winnerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SparePartDetails` ADD CONSTRAINT `SparePartDetails_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
