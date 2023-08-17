/*
  Warnings:

  - You are about to drop the `_History` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Music" DROP CONSTRAINT "Music_albumId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_History" DROP CONSTRAINT "_History_A_fkey";

-- DropForeignKey
ALTER TABLE "_History" DROP CONSTRAINT "_History_B_fkey";

-- AlterTable
ALTER TABLE "Music" ALTER COLUMN "previewUrl" DROP NOT NULL;

-- DropTable
DROP TABLE "_History";

-- CreateTable
CREATE TABLE "History" (
    "userId" TEXT NOT NULL,
    "musicId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("userId","musicId")
);

-- CreateTable
CREATE TABLE "Queue" (
    "userId" TEXT NOT NULL,
    "musicId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("userId","musicId")
);

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;
