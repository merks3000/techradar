-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('Techniques', 'Platforms', 'Tools', 'Languages_Frameworks');

-- CreateEnum
CREATE TYPE "public"."Ring" AS ENUM ('Assess', 'Trial', 'Adopt', 'Hold');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Draft', 'Published');

-- CreateTable
CREATE TABLE "public"."Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."Category" NOT NULL,
    "ring" "public"."Ring",
    "techDescription" TEXT NOT NULL,
    "classificationNote" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'Draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Technology_status_category_ring_idx" ON "public"."Technology"("status", "category", "ring");

-- CreateIndex
CREATE INDEX "Technology_publishedAt_idx" ON "public"."Technology"("publishedAt");
