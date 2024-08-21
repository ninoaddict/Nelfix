-- DropForeignKey
ALTER TABLE "UserBoughtFilm" DROP CONSTRAINT "UserBoughtFilm_filmId_fkey";

-- DropForeignKey
ALTER TABLE "UserBoughtFilm" DROP CONSTRAINT "UserBoughtFilm_userId_fkey";

-- CreateTable
CREATE TABLE "_FilmToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FilmToUser_AB_unique" ON "_FilmToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FilmToUser_B_index" ON "_FilmToUser"("B");

-- AddForeignKey
ALTER TABLE "UserBoughtFilm" ADD CONSTRAINT "UserBoughtFilm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBoughtFilm" ADD CONSTRAINT "UserBoughtFilm_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmToUser" ADD CONSTRAINT "_FilmToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmToUser" ADD CONSTRAINT "_FilmToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
