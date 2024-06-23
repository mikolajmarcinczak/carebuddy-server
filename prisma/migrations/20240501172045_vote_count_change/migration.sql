/*
  Warnings:

  - The `tags` column on the `knowledgebasearticle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `related_urls` column on the `noteentity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "knowledgebasearticle" DROP COLUMN "tags";
ALTER TABLE "knowledgebasearticle" ADD COLUMN     "tags" STRING(255)[];

-- AlterTable
ALTER TABLE "noteentity" DROP COLUMN "related_urls";
ALTER TABLE "noteentity" ADD COLUMN     "related_urls" STRING(2083)[];
