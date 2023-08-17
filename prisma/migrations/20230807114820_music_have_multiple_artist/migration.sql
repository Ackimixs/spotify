/*
  Warnings:

  - You are about to drop the column `author` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Music` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Music` table. All the data in the column will be lost.
  - The required column `authorId` was added to the `Album` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `artistId` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "author",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Music" DROP COLUMN "author",
DROP COLUMN "authorId",
ADD COLUMN     "artistId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
