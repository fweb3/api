-- CreateTable
CREATE TABLE "BlackList" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "account" TEXT,

    CONSTRAINT "BlackList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlackList_ip_key" ON "BlackList"("ip");

-- CreateIndex
CREATE INDEX "BlackList_ip_idx" ON "BlackList" USING HASH ("ip");
