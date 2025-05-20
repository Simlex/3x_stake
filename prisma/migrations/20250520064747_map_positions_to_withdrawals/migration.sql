/*
  Warnings:

  - A unique constraint covering the columns `[stakingPositionId]` on the table `withdrawals` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `withdrawals` ADD COLUMN `stakingPositionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `withdrawals_stakingPositionId_key` ON `withdrawals`(`stakingPositionId`);

-- AddForeignKey
ALTER TABLE `withdrawals` ADD CONSTRAINT `withdrawals_stakingPositionId_fkey` FOREIGN KEY (`stakingPositionId`) REFERENCES `staking_positions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
