-- DropForeignKey
ALTER TABLE "IpInfo" DROP CONSTRAINT "IpInfo_userId_fkey";

-- DropForeignKey
ALTER TABLE "Twitter" DROP CONSTRAINT "Twitter_userId_fkey";

-- AddForeignKey
ALTER TABLE "IpInfo" ADD CONSTRAINT "IpInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Twitter" ADD CONSTRAINT "Twitter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
