-- CreateTable
CREATE TABLE "_CustomerChits" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CustomerChits_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CustomerChits_B_index" ON "_CustomerChits"("B");

-- AddForeignKey
ALTER TABLE "_CustomerChits" ADD CONSTRAINT "_CustomerChits_A_fkey" FOREIGN KEY ("A") REFERENCES "Chit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerChits" ADD CONSTRAINT "_CustomerChits_B_fkey" FOREIGN KEY ("B") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
