/*
  Warnings:

  - The `tags` column on the `knowledgebasearticle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `related_urls` column on the `noteentity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetPass]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "knowledgebasearticle" DROP COLUMN "tags";
ALTER TABLE "knowledgebasearticle" ADD COLUMN     "tags" STRING(255)[];

-- AlterTable
ALTER TABLE "noteentity" DROP COLUMN "related_urls";
ALTER TABLE "noteentity" ADD COLUMN     "related_urls" STRING(2083)[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetExp" INT4;
ALTER TABLE "users" ADD COLUMN     "resetPass" STRING;
ALTER TABLE "users" ADD COLUMN     "retry" INT4 DEFAULT 0;
ALTER TABLE "users" ADD COLUMN     "retryExp" INT4;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetPass_key" ON "users"("resetPass");
