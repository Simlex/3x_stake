-- AlterTable
ALTER TABLE `staking_plans` ADD COLUMN `firstDownlineBonus` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `secondDownlineBonus` DOUBLE NOT NULL DEFAULT 0;
