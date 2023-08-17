/*
  Warnings:

  - You are about to drop the column `duration` on the `Music` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Music" DROP COLUMN "duration";

-- CreateTable
CREATE TABLE "_LikedMusics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_History" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikedMusics_AB_unique" ON "_LikedMusics"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedMusics_B_index" ON "_LikedMusics"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_History_AB_unique" ON "_History"("A", "B");

-- CreateIndex
CREATE INDEX "_History_B_index" ON "_History"("B");

-- AddForeignKey
ALTER TABLE "_LikedMusics" ADD CONSTRAINT "_LikedMusics_A_fkey" FOREIGN KEY ("A") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedMusics" ADD CONSTRAINT "_LikedMusics_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_History" ADD CONSTRAINT "_History_A_fkey" FOREIGN KEY ("A") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_History" ADD CONSTRAINT "_History_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
