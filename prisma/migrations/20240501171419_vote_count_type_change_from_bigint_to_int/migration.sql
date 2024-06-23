/*
  Warnings:

  - You are about to alter the column `vote_count` on the `caregiveraccountinfo` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - The `tags` column on the `knowledgebasearticle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `related_urls` column on the `noteentity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "caregiveraccountinfo" ALTER COLUMN "vote_count" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "knowledgebasearticle" DROP COLUMN "tags";
ALTER TABLE "knowledgebasearticle" ADD COLUMN     "tags" STRING(255)[];

-- AlterTable
ALTER TABLE "noteentity" DROP COLUMN "related_urls";
ALTER TABLE "noteentity" ADD COLUMN     "related_urls" STRING(2083)[];
