-- CreateTable
CREATE TABLE "Emoji" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "unified" TEXT NOT NULL,
    "colons" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
