/*
  Warnings:

  - You are about to drop the column `authorId` on the `Album` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spotifyId]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotifyId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotifyId]` on the table `Music` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotifyId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spotifyId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `Music` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Music" DROP CONSTRAINT "Music_artistId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "authorId",
ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Music" ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_AlbumArtists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MusicArtists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlbumArtists_AB_unique" ON "_AlbumArtists"("A", "B");

-- CreateIndex
CREATE INDEX "_AlbumArtists_B_index" ON "_AlbumArtists"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MusicArtists_AB_unique" ON "_MusicArtists"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicArtists_B_index" ON "_MusicArtists"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Album_spotifyId_key" ON "Album"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_spotifyId_key" ON "Artist"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Music_spotifyId_key" ON "Music"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_spotifyId_key" ON "Playlist"("spotifyId");

-- AddForeignKey
ALTER TABLE "_AlbumArtists" ADD CONSTRAINT "_AlbumArtists_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumArtists" ADD CONSTRAINT "_AlbumArtists_B_fkey" FOREIGN KEY ("B") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MusicArtists" ADD CONSTRAINT "_MusicArtists_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MusicArtists" ADD CONSTRAINT "_MusicArtists_B_fkey" FOREIGN KEY ("B") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;
