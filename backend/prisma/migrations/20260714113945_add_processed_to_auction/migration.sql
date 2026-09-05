/*
  Warnings:

  - You are about to drop the column `bidderId` on the `bid` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bid` DROP FOREIGN KEY `Bid_bidderId_fkey`;

-- DropIndex
DROP INDEX `Bid_bidderId_fkey` ON `bid`;

-- AlterTable
ALTER TABLE `auction` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `processed` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `bid` DROP COLUMN `bidderId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `parentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `listing` ADD COLUMN `rejectReason` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `listingId` INTEGER NULL,
    `auctionId` INTEGER NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EquipmentDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listingId` INTEGER NOT NULL,
    `manufacturer` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `year` INTEGER NULL,
    `hoursWorked` INTEGER NULL,
    `mechanicalCondition` VARCHAR(191) NULL,
    `hydraulicCondition` VARCHAR(191) NULL,

    UNIQUE INDEX `EquipmentDetails_listingId_key`(`listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listingId` INTEGER NOT NULL,
    `propertyType` VARCHAR(191) NULL,
    `bedrooms` INTEGER NULL,
    `bathrooms` INTEGER NULL,
    `plotSize` DOUBLE NULL,
    `titleDocument` VARCHAR(191) NULL,

    UNIQUE INDEX `PropertyDetails_listingId_key`(`listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuarryDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listingId` INTEGER NOT NULL,
    `quarryType` VARCHAR(191) NULL,
    `reserveEstimate` DOUBLE NULL,
    `productionCapacity` VARCHAR(191) NULL,
    `miningLicense` VARCHAR(191) NULL,

    UNIQUE INDEX `QuarryDetails_listingId_key`(`listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Bid_bidderId_fkey` ON `Bid`(`userId`);

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_bidderId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquipmentDetails` ADD CONSTRAINT `EquipmentDetails_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyDetails` ADD CONSTRAINT `PropertyDetails_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuarryDetails` ADD CONSTRAINT `QuarryDetails_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
