/*
  Warnings:

  - You are about to drop the `_CustomerChits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CustomerChits" DROP CONSTRAINT "_CustomerChits_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomerChits" DROP CONSTRAINT "_CustomerChits_B_fkey";

-- DropTable
DROP TABLE "_CustomerChits";
