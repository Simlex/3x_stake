/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `admin_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `admin_sessions_token_key` ON `admin_sessions`;

-- AlterTable
ALTER TABLE `admin_sessions` MODIFY `token` LONGTEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `admin_sessions_token_key` ON `admin_sessions`(`token`(191));
