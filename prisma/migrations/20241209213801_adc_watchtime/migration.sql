-- CreateTable
CREATE TABLE "WatchTimes" (
    "seconds" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchTimes_pkey" PRIMARY KEY ("userId","episodeId")
);

-- AddForeignKey
ALTER TABLE "WatchTimes" ADD CONSTRAINT "WatchTimes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchTimes" ADD CONSTRAINT "WatchTimes_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
