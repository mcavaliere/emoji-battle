/*
  Warnings:

  - A unique constraint covering the columns `[unified]` on the table `Emoji` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `native` to the `Emoji` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Emoji" ADD COLUMN     "native" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Emoji_unified_key" ON "Emoji"("unified");

-- RenameIndex
ALTER INDEX "Account.compound_id_unique" RENAME TO "Account_compound_id_key";

-- RenameIndex
ALTER INDEX "Session.accessToken_unique" RENAME TO "Session_accessToken_key";

-- RenameIndex
ALTER INDEX "Session.sessionToken_unique" RENAME TO "Session_sessionToken_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "VerificationRequest.token_unique" RENAME TO "VerificationRequest_token_key";
