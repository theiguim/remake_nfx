-- CreateTable
CREATE TABLE "Episodes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "secondsLong" INTEGER,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Episodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Episodes" ADD CONSTRAINT "Episodes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
