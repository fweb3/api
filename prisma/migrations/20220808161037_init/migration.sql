-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'ADMIN', 'ROOT');

-- CreateEnum
CREATE TYPE "BlacklistReason" AS ENUM ('BLACKLIST_UNKNOWN', 'BLACKLIST_SPAMMING', 'BLACKLIST_BAD_VERIFY_ATTEMPT', 'BLACKLIST_IP_BLOCK', 'BLACKLIST_ACCOUNT_BLOCK');

-- CreateTable
CREATE TABLE "User" (
    "account" TEXT NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT,
    "discord" TEXT,
    "ens" TEXT,
    "role" "Role" DEFAULT 'PLAYER',
    "active" BOOLEAN DEFAULT true,
    "clientInfo" TEXT,
    "hasReceivedCode" BOOLEAN DEFAULT false,
    "fweb3AttempedAt" TIMESTAMP(3),
    "fweb3FaucetSuccess" BOOLEAN DEFAULT false,
    "maticAttemptedAt" TIMESTAMP(3),
    "maticFaucetSuccess" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("account")
);

-- CreateTable
CREATE TABLE "Twitter" (
    "id" TEXT NOT NULL,
    "account" TEXT NOT NULL,
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
CREATE TABLE "Blacklist" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "account" TEXT,
    "reason" "BlacklistReason" NOT NULL DEFAULT 'BLACKLIST_UNKNOWN',

    CONSTRAINT "Blacklist_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Twitter_account_key" ON "Twitter"("account");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_name_key" ON "Twitter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_twitterId_key" ON "Twitter"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_username_key" ON "Twitter"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_ip_key" ON "Blacklist"("ip");

-- CreateIndex
CREATE INDEX "Blacklist_ip_idx" ON "Blacklist" USING HASH ("ip");

-- AddForeignKey
ALTER TABLE "Twitter" ADD CONSTRAINT "Twitter_account_fkey" FOREIGN KEY ("account") REFERENCES "User"("account") ON DELETE CASCADE ON UPDATE CASCADE;
