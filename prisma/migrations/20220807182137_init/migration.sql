-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'ADMIN', 'ROOT');

-- CreateTable
CREATE TABLE "User" (
    "account" TEXT NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "discord" TEXT,
    "ens" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PLAYER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "clientInfo" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("account")
);

-- CreateTable
CREATE TABLE "IpInfo" (
    "id" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "ip" TEXT,
    "hostname" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "loc" TEXT,
    "org" TEXT,
    "postal" TEXT,
    "timezone" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "IpInfo_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "BlackList" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "account" TEXT,

    CONSTRAINT "BlackList_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "IpInfo_account_key" ON "IpInfo"("account");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_account_key" ON "Twitter"("account");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_name_key" ON "Twitter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_twitterId_key" ON "Twitter"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "Twitter_username_key" ON "Twitter"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BlackList_ip_key" ON "BlackList"("ip");

-- CreateIndex
CREATE INDEX "BlackList_ip_idx" ON "BlackList" USING HASH ("ip");

-- AddForeignKey
ALTER TABLE "IpInfo" ADD CONSTRAINT "IpInfo_account_fkey" FOREIGN KEY ("account") REFERENCES "User"("account") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Twitter" ADD CONSTRAINT "Twitter_account_fkey" FOREIGN KEY ("account") REFERENCES "User"("account") ON DELETE CASCADE ON UPDATE CASCADE;
