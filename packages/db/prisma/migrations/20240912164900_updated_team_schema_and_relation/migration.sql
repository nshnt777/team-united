/*
  Warnings:

  - Added the required column `hobbyId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `UserTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "description" TEXT,
ADD COLUMN     "hobbyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserTeam" ADD COLUMN     "role" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
