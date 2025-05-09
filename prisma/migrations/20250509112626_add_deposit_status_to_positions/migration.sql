/*
  Warnings:

  - You are about to drop the column `status` on the `staking_positions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `staking_positions` DROP COLUMN `status`,
    ADD COLUMN `depositStatus` ENUM('APPROVED', 'REJECTED', 'PENDING', 'CANCELED') NOT NULL DEFAULT 'PENDING';
