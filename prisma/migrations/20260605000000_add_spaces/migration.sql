-- CreateTable
CREATE TABLE "spaces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "owner_id" UUID NOT NULL DEFAULT auth.uid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "space_id" UUID NOT NULL,
    "user_id" UUID NOT NULL DEFAULT auth.uid(),
    "role" TEXT NOT NULL DEFAULT 'member',
    "display_name" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "space_members_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "categories" ADD COLUMN "space_id" UUID;

-- AlterTable
ALTER TABLE "payments_methods" ADD COLUMN "space_id" UUID;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN "space_id" UUID;

-- CreateIndex
CREATE INDEX "spaces_owner_id_idx" ON "spaces"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "space_members_space_id_user_id_key" ON "space_members"("space_id", "user_id");

-- CreateIndex
CREATE INDEX "space_members_user_id_idx" ON "space_members"("user_id");

-- CreateIndex
CREATE INDEX "categories_space_id_idx" ON "categories"("space_id");

-- CreateIndex
CREATE INDEX "payments_methods_space_id_idx" ON "payments_methods"("space_id");

-- CreateIndex
CREATE INDEX "transactions_space_id_idx" ON "transactions"("space_id");

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "space_members" ADD CONSTRAINT "space_members_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "space_members" ADD CONSTRAINT "space_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments_methods" ADD CONSTRAINT "payments_methods_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Row Level Security
ALTER TABLE "spaces" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "space_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments_methods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;

-- Authorization helpers avoid recursive RLS checks.
CREATE OR REPLACE FUNCTION public.is_space_member(requested_space_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM "space_members"
        WHERE "space_members"."space_id" = requested_space_id
          AND "space_members"."user_id" = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.is_space_owner(requested_space_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM "spaces"
        WHERE "spaces"."id" = requested_space_id
          AND "spaces"."owner_id" = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.is_space_member(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_space_owner(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_space_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_space_owner(UUID) TO authenticated;

-- Policies for spaces
CREATE POLICY "spaces_select_for_members"
ON "spaces"
FOR SELECT
TO authenticated
USING (
    "owner_id" = auth.uid()
    OR public.is_space_member("id")
);

CREATE POLICY "spaces_insert_for_owner"
ON "spaces"
FOR INSERT
TO authenticated
WITH CHECK ("owner_id" = auth.uid());

CREATE POLICY "spaces_update_for_owner"
ON "spaces"
FOR UPDATE
TO authenticated
USING ("owner_id" = auth.uid())
WITH CHECK ("owner_id" = auth.uid());

CREATE POLICY "spaces_delete_for_owner"
ON "spaces"
FOR DELETE
TO authenticated
USING ("owner_id" = auth.uid());

-- Policies for space_members
CREATE POLICY "space_members_select_for_same_space_members"
ON "space_members"
FOR SELECT
TO authenticated
USING (
    "user_id" = auth.uid()
    OR public.is_space_owner("space_id")
);

CREATE POLICY "space_members_insert_self_or_space_owner"
ON "space_members"
FOR INSERT
TO authenticated
WITH CHECK (
    "user_id" = auth.uid()
    OR public.is_space_owner("space_id")
);

CREATE POLICY "space_members_delete_self_or_space_owner"
ON "space_members"
FOR DELETE
TO authenticated
USING (
    "user_id" = auth.uid()
    OR public.is_space_owner("space_id")
);

-- Policies for financial data
CREATE POLICY "categories_all_for_space_members"
ON "categories"
FOR ALL
TO authenticated
USING (
    public.is_space_member("space_id")
)
WITH CHECK (
    public.is_space_member("space_id")
);

CREATE POLICY "payments_methods_all_for_space_members"
ON "payments_methods"
FOR ALL
TO authenticated
USING (
    public.is_space_member("space_id")
)
WITH CHECK (
    public.is_space_member("space_id")
);

CREATE POLICY "transactions_all_for_space_members"
ON "transactions"
FOR ALL
TO authenticated
USING (
    public.is_space_member("space_id")
)
WITH CHECK (
    public.is_space_member("space_id")
);
