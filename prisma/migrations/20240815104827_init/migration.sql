/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `Film` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Film` table. All the data in the column will be lost.
  - Added the required column `cover_image_url` to the `Film` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_url` to the `Film` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Film" DROP COLUMN "coverUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "cover_image_url" TEXT NOT NULL,
ADD COLUMN     "video_url" TEXT NOT NULL;
