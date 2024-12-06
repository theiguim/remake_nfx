-- CreateTable
CREATE TABLE "Likes" (
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("userId","courseId")
);

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
