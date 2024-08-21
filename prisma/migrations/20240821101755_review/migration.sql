-- AlterTable
ALTER TABLE "Film" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "FilmReview" (
    "userId" TEXT NOT NULL,
    "filmId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "FilmReview_pkey" PRIMARY KEY ("userId","filmId")
);

-- AddForeignKey
ALTER TABLE "FilmReview" ADD CONSTRAINT "FilmReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmReview" ADD CONSTRAINT "FilmReview_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;
