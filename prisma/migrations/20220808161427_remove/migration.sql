/*
  Warnings:

  - You are about to drop the column `profileImageUrl` on the `Twitter` table. All the data in the column will be lost.
  - You are about to drop the column `discord` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ens` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_discord_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_ens_key";

-- AlterTable
ALTER TABLE "Twitter" DROP COLUMN "profileImageUrl";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discord",
DROP COLUMN "email",
DROP COLUMN "ens";
