-- CreateTable
CREATE TABLE "_UserEpisode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserEpisode_AB_unique" ON "_UserEpisode"("A", "B");

-- CreateIndex
CREATE INDEX "_UserEpisode_B_index" ON "_UserEpisode"("B");

-- AddForeignKey
ALTER TABLE "_UserEpisode" ADD CONSTRAINT "_UserEpisode_A_fkey" FOREIGN KEY ("A") REFERENCES "Episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserEpisode" ADD CONSTRAINT "_UserEpisode_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
