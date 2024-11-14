/*
  Warnings:

  - You are about to drop the `Publisher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Publisher";

-- CreateTable
CREATE TABLE "Courses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "synopsis" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
