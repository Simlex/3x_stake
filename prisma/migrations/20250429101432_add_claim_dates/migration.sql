-- AlterTable
ALTER TABLE `staking_positions` ADD COLUMN `lastClaimedAt` DATETIME(3) NULL,
    ADD COLUMN `nextClaimDeadline` DATETIME(3) NULL;
