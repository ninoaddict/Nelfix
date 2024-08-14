-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(200),
    "password" TEXT NOT NULL,
    "imageUrl" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Film" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "director" TEXT,
    "release_year" INTEGER NOT NULL,
    "genre" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,

    CONSTRAINT "Film_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
