-- AlterTable
ALTER TABLE "transactions" ADD COLUMN "subcategory_id" UUID;

-- Migrate transactions currently linked directly to a subcategory.
UPDATE "transactions" AS "transaction"
SET
    "subcategory_id" = "transaction"."category_id",
    "category_id" = "category"."parent_id"
FROM "categories" AS "category"
WHERE
    "transaction"."category_id" = "category"."id"
    AND "category"."parent_id" IS NOT NULL;

-- CreateIndex
CREATE INDEX "transactions_subcategory_id_idx" ON "transactions"("subcategory_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
