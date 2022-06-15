/*
  Warnings:

  - You are about to drop the column `colons` on the `Emoji` table. All the data in the column will be lost.
  - Added the required column `shortcodes` to the `Emoji` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Emoji"
RENAME COLUMN "colons" to "shortcodes";
