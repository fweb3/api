-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'ADMIN', 'ROOT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "account" TEXT NOT NULL,
    "email" TEXT,
    "discord" TEXT,
    "ens" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PLAYER',
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IpInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT,
    "hostname" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "loc" TEXT,
    "org" TEXT,
    "postal" TEXT,
    "timezone" TEXT,

    CONSTRAINT "IpInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Twitter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "name" TEXT,
    "twitterId" TEXT,
    "username" TEXT,
    "followersCount" INTEGER,
    "followingCount" INTEGER,
    "tweetCount" INTEGER,
    "location" TEXT,
    "twitterCreatedAt" TIMESTAMP(3),

    CONSTRAINT "Twitter_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_discord_key" ON "User"("discord");

-- CreateIndex
CREATE UNIQUE INDEX "User_ens_key" ON "User"("ens");

-- CreateIndex
CREATE UNIQUE INDEX "IpInfo_userId_key" ON "IpInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_userId_key" ON "Twitter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_name_key" ON "Twitter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_twitterId_key" ON "Twitter"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_username_key" ON "Twitter"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TaskState_userId_key" ON "TaskState"("userId");

-- AddForeignKey
ALTER TABLE "IpInfo" ADD CONSTRAINT "IpInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Twitter" ADD CONSTRAINT "Twitter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskState" ADD CONSTRAINT "TaskState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
