-- CreateTable
CREATE TABLE "Hobby" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHobby" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hobbyId" INTEGER NOT NULL,

    CONSTRAINT "UserHobby_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hobby_name_key" ON "Hobby"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserHobby_userId_hobbyId_key" ON "UserHobby"("userId", "hobbyId");

-- AddForeignKey
ALTER TABLE "UserHobby" ADD CONSTRAINT "UserHobby_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHobby" ADD CONSTRAINT "UserHobby_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
