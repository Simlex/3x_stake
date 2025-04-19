/*
  Warnings:

  - Added the required column `apy` to the `StakingPosition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StakingPosition` ADD COLUMN `apy` DECIMAL(10, 2) NOT NULL;
