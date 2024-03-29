-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'ADMIN', 'ROOT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "account" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "ens" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PLAYER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hasWonGame" BOOLEAN NOT NULL DEFAULT false,
    "hasUsedFweb3Faucet" BOOLEAN NOT NULL DEFAULT false,
    "hasUsedMaticFaucet" BOOLEAN NOT NULL DEFAULT false,
    "hasSentTokens" BOOLEAN NOT NULL DEFAULT false,
    "hasMintedDiamondNFT" BOOLEAN NOT NULL DEFAULT false,
    "hasBurnedTokens" BOOLEAN NOT NULL DEFAULT false,
    "hasSwappedTokens" BOOLEAN NOT NULL DEFAULT false,
    "hasVotedInPoll" BOOLEAN NOT NULL DEFAULT false,
    "hasDeployedContract" BOOLEAN NOT NULL DEFAULT false,
    "trophyId" TEXT,

    CONSTRAINT "TaskState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_account_key" ON "User"("account");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "User_ens_key" ON "User"("ens");

-- CreateIndex
CREATE UNIQUE INDEX "TaskState_userId_key" ON "TaskState"("userId");

-- AddForeignKey
ALTER TABLE "TaskState" ADD CONSTRAINT "TaskState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
