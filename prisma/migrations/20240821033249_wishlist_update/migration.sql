/*
  Warnings:

  - You are about to drop the `_FilmToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FilmToUser" DROP CONSTRAINT "_FilmToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilmToUser" DROP CONSTRAINT "_FilmToUser_B_fkey";

-- DropTable
DROP TABLE "_FilmToUser";

-- CreateTable
CREATE TABLE "WishList" (
    "userId" TEXT NOT NULL,
    "filmId" TEXT NOT NULL,

    CONSTRAINT "WishList_pkey" PRIMARY KEY ("userId","filmId")
);

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;
