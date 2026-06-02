-- CreateEnum
CREATE TYPE "RegionCode" AS ENUM ('ZNZ', 'DSM', 'ARU', 'DOD', 'MWZ');

-- CreateEnum
CREATE TYPE "MaterialCategorySlug" AS ENUM ('CEMENT', 'REBARS', 'BRC', 'CONCRETE', 'AGGREGATES', 'BLOCKS', 'BRICKS', 'ROOFING', 'TILES', 'PAINT', 'TIMBER', 'ALUMINIUM', 'GLASS', 'FURNITURE', 'HOSPITALITY_FFE', 'COMMERCIAL_KITCHENS');

-- CreateEnum
CREATE TYPE "PriceSource" AS ENUM ('APIFY_SCRAPER', 'SUPPLIER_SUBMISSION', 'ADMIN_SEED', 'AI_EXTRACTION', 'PARTNER_FEED', 'MANUAL');

-- CreateEnum
CREATE TYPE "ObservationStatus" AS ENUM ('ACTIVE', 'STALE', 'REJECTED', 'PENDING_REVIEW');

-- CreateEnum
CREATE TYPE "QualityTier" AS ENUM ('BASIC', 'MID', 'PREMIUM');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('VILLA', 'HOTEL', 'RESORT', 'RESIDENTIAL_BLOCK', 'OFFICE', 'WAREHOUSE', 'COMMERCIAL', 'HOSPITALITY_FITOUT', 'RENOVATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BOQDocumentStatus" AS ENUM ('RECEIVED', 'PARSING', 'PARSED', 'NEEDS_REVIEW', 'FAILED');

-- CreateEnum
CREATE TYPE "BOQDocumentKind" AS ENUM ('EXCEL', 'CSV', 'PDF_TEXT', 'PDF_SCANNED', 'IMAGE', 'MANUAL_PASTE');

-- CreateEnum
CREATE TYPE "ProcurementTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'BLOCKED', 'COMPLETE', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ProcurementTaskKind" AS ENUM ('RFQ_AWARDED', 'PO_ISSUED', 'SUPPLIER_CONFIRMED', 'PRODUCTION', 'SHIPPED', 'IN_TRANSIT_CUSTOMS', 'DELIVERED', 'SITE_RECEIVED', 'SIGNED_OFF', 'CUSTOM');

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "code" "RegionCode" NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Tanzania',
    "centerLat" DECIMAL(65,30),
    "centerLng" DECIMAL(65,30),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialCategoryRef" (
    "id" TEXT NOT NULL,
    "slug" "MaterialCategorySlug" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "parentSlug" TEXT,
    "isHospitality" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "shareByProjectType" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialCategoryRef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categorySlug" "MaterialCategorySlug" NOT NULL,
    "spec" TEXT,
    "unit" TEXT NOT NULL,
    "baseUnitFactor" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "description" TEXT,
    "imageUrl" TEXT,
    "aliases" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialVariant" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "brand" TEXT,
    "sku" TEXT,
    "spec" TEXT,
    "unit" TEXT,
    "imageUrl" TEXT,
    "attributes" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceObservation" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "variantId" TEXT,
    "regionId" TEXT NOT NULL,
    "source" "PriceSource" NOT NULL,
    "sourceUrl" TEXT,
    "supplierId" TEXT,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TZS',
    "quantity" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "unit" TEXT,
    "vatIncluded" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "rawPayload" JSONB,
    "confidence" INTEGER NOT NULL DEFAULT 50,
    "status" "ObservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialPriceIndex" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "granularity" TEXT NOT NULL DEFAULT 'daily',
    "currency" TEXT NOT NULL DEFAULT 'TZS',
    "unit" TEXT,
    "p25" DECIMAL(65,30),
    "median" DECIMAL(65,30),
    "p75" DECIMAL(65,30),
    "mean" DECIMAL(65,30),
    "stddev" DECIMAL(65,30),
    "sampleSize" INTEGER NOT NULL DEFAULT 0,
    "changePct" DECIMAL(65,30),
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialPriceIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialSupplier" (
    "id" TEXT NOT NULL,
    "supplierProfileId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "variantId" TEXT,
    "regionId" TEXT NOT NULL,
    "unitPrice" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'TZS',
    "unit" TEXT,
    "stockStatus" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "leadTimeDays" INTEGER,
    "minOrderQty" DECIMAL(65,30),
    "deliveryRadiusKm" INTEGER,
    "lastPricedAt" TIMESTAMP(3),
    "notes" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostBenchmark" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "projectType" "ProjectType" NOT NULL,
    "qualityTier" "QualityTier" NOT NULL,
    "sqmCostMedian" DECIMAL(65,30) NOT NULL,
    "sqmCostP25" DECIMAL(65,30),
    "sqmCostP75" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "source" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEstimate" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT,
    "sessionRef" TEXT,
    "projectName" TEXT,
    "projectType" "ProjectType" NOT NULL,
    "qualityTier" "QualityTier" NOT NULL,
    "regionId" TEXT NOT NULL,
    "builtUpAreaSqm" DECIMAL(65,30) NOT NULL,
    "budgetMin" DECIMAL(65,30),
    "budgetMedian" DECIMAL(65,30),
    "budgetMax" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "assumptions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectEstimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimateLineItem" (
    "id" TEXT NOT NULL,
    "estimateId" TEXT NOT NULL,
    "materialId" TEXT,
    "categorySlug" "MaterialCategorySlug" NOT NULL,
    "label" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,
    "unit" TEXT,
    "unitPriceMedian" DECIMAL(65,30),
    "costMedian" DECIMAL(65,30),
    "costMin" DECIMAL(65,30),
    "costMax" DECIMAL(65,30),
    "sharePct" DECIMAL(65,30),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstimateLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BOQDocument" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT,
    "projectId" TEXT,
    "filename" TEXT,
    "fileUrl" TEXT,
    "kind" "BOQDocumentKind" NOT NULL,
    "status" "BOQDocumentStatus" NOT NULL DEFAULT 'RECEIVED',
    "rawText" TEXT,
    "parsed" JSONB,
    "parseError" TEXT,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "matchedCount" INTEGER NOT NULL DEFAULT 0,
    "costEstimateTzs" DECIMAL(65,30),
    "costEstimateUsd" DECIMAL(65,30),
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parsedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BOQDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialSchedule" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT,
    "projectId" TEXT,
    "boqDocumentId" TEXT,
    "regionId" TEXT NOT NULL,
    "title" TEXT,
    "notes" TEXT,
    "totalsByCategory" JSONB,
    "grandTotalTzs" DECIMAL(65,30),
    "grandTotalUsd" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'TZS',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "exportedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleLineItem" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "materialId" TEXT,
    "description" TEXT NOT NULL,
    "categorySlug" "MaterialCategorySlug",
    "qty" DECIMAL(65,30) NOT NULL,
    "unit" TEXT,
    "unitPriceMedian" DECIMAL(65,30),
    "unitPriceLow" DECIMAL(65,30),
    "unitPriceHigh" DECIMAL(65,30),
    "costMedian" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'TZS',
    "topSuppliers" JSONB,
    "matchScore" DECIMAL(65,30),
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduleLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcurementPlan" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "projectId" TEXT,
    "scheduleId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "totalBudgetTzs" DECIMAL(65,30),
    "totalBudgetUsd" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'TZS',
    "startDate" TIMESTAMP(3),
    "targetEndDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcurementPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcurementTask" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "kind" "ProcurementTaskKind" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProcurementTaskStatus" NOT NULL DEFAULT 'PENDING',
    "rfqId" TEXT,
    "orderId" TEXT,
    "supplierId" TEXT,
    "assigneeId" TEXT,
    "dueDate" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "position" INTEGER NOT NULL DEFAULT 0,
    "attachments" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcurementTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "regionId" TEXT,
    "thresholdPct" DECIMAL(65,30) NOT NULL DEFAULT 5,
    "direction" TEXT NOT NULL DEFAULT 'ANY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE INDEX "Region_isActive_idx" ON "Region"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialCategoryRef_slug_key" ON "MaterialCategoryRef"("slug");

-- CreateIndex
CREATE INDEX "MaterialCategoryRef_isHospitality_idx" ON "MaterialCategoryRef"("isHospitality");

-- CreateIndex
CREATE UNIQUE INDEX "Material_slug_key" ON "Material"("slug");

-- CreateIndex
CREATE INDEX "Material_categorySlug_idx" ON "Material"("categorySlug");

-- CreateIndex
CREATE INDEX "Material_isActive_idx" ON "Material"("isActive");

-- CreateIndex
CREATE INDEX "Material_categorySlug_isActive_idx" ON "Material"("categorySlug", "isActive");

-- CreateIndex
CREATE INDEX "MaterialVariant_materialId_idx" ON "MaterialVariant"("materialId");

-- CreateIndex
CREATE INDEX "MaterialVariant_brand_idx" ON "MaterialVariant"("brand");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialVariant_materialId_brand_spec_key" ON "MaterialVariant"("materialId", "brand", "spec");

-- CreateIndex
CREATE INDEX "PriceObservation_materialId_idx" ON "PriceObservation"("materialId");

-- CreateIndex
CREATE INDEX "PriceObservation_variantId_idx" ON "PriceObservation"("variantId");

-- CreateIndex
CREATE INDEX "PriceObservation_regionId_idx" ON "PriceObservation"("regionId");

-- CreateIndex
CREATE INDEX "PriceObservation_status_idx" ON "PriceObservation"("status");

-- CreateIndex
CREATE INDEX "PriceObservation_observedAt_idx" ON "PriceObservation"("observedAt");

-- CreateIndex
CREATE INDEX "PriceObservation_materialId_regionId_status_idx" ON "PriceObservation"("materialId", "regionId", "status");

-- CreateIndex
CREATE INDEX "PriceObservation_materialId_regionId_observedAt_idx" ON "PriceObservation"("materialId", "regionId", "observedAt");

-- CreateIndex
CREATE INDEX "MaterialPriceIndex_materialId_regionId_granularity_idx" ON "MaterialPriceIndex"("materialId", "regionId", "granularity");

-- CreateIndex
CREATE INDEX "MaterialPriceIndex_periodStart_idx" ON "MaterialPriceIndex"("periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialPriceIndex_materialId_regionId_periodStart_granular_key" ON "MaterialPriceIndex"("materialId", "regionId", "periodStart", "granularity");

-- CreateIndex
CREATE INDEX "MaterialSupplier_supplierProfileId_idx" ON "MaterialSupplier"("supplierProfileId");

-- CreateIndex
CREATE INDEX "MaterialSupplier_materialId_regionId_isActive_idx" ON "MaterialSupplier"("materialId", "regionId", "isActive");

-- CreateIndex
CREATE INDEX "MaterialSupplier_regionId_idx" ON "MaterialSupplier"("regionId");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialSupplier_supplierProfileId_materialId_variantId_reg_key" ON "MaterialSupplier"("supplierProfileId", "materialId", "variantId", "regionId");

-- CreateIndex
CREATE INDEX "CostBenchmark_regionId_projectType_qualityTier_isActive_idx" ON "CostBenchmark"("regionId", "projectType", "qualityTier", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "CostBenchmark_regionId_projectType_qualityTier_effectiveFro_key" ON "CostBenchmark"("regionId", "projectType", "qualityTier", "effectiveFrom");

-- CreateIndex
CREATE INDEX "ProjectEstimate_buyerId_idx" ON "ProjectEstimate"("buyerId");

-- CreateIndex
CREATE INDEX "ProjectEstimate_projectType_regionId_idx" ON "ProjectEstimate"("projectType", "regionId");

-- CreateIndex
CREATE INDEX "ProjectEstimate_createdAt_idx" ON "ProjectEstimate"("createdAt");

-- CreateIndex
CREATE INDEX "EstimateLineItem_estimateId_idx" ON "EstimateLineItem"("estimateId");

-- CreateIndex
CREATE INDEX "EstimateLineItem_categorySlug_idx" ON "EstimateLineItem"("categorySlug");

-- CreateIndex
CREATE INDEX "BOQDocument_buyerId_idx" ON "BOQDocument"("buyerId");

-- CreateIndex
CREATE INDEX "BOQDocument_projectId_idx" ON "BOQDocument"("projectId");

-- CreateIndex
CREATE INDEX "BOQDocument_status_idx" ON "BOQDocument"("status");

-- CreateIndex
CREATE INDEX "MaterialSchedule_buyerId_idx" ON "MaterialSchedule"("buyerId");

-- CreateIndex
CREATE INDEX "MaterialSchedule_projectId_idx" ON "MaterialSchedule"("projectId");

-- CreateIndex
CREATE INDEX "MaterialSchedule_regionId_idx" ON "MaterialSchedule"("regionId");

-- CreateIndex
CREATE INDEX "MaterialSchedule_status_idx" ON "MaterialSchedule"("status");

-- CreateIndex
CREATE INDEX "MaterialSchedule_createdAt_idx" ON "MaterialSchedule"("createdAt");

-- CreateIndex
CREATE INDEX "ScheduleLineItem_scheduleId_idx" ON "ScheduleLineItem"("scheduleId");

-- CreateIndex
CREATE INDEX "ScheduleLineItem_materialId_idx" ON "ScheduleLineItem"("materialId");

-- CreateIndex
CREATE INDEX "ScheduleLineItem_categorySlug_idx" ON "ScheduleLineItem"("categorySlug");

-- CreateIndex
CREATE INDEX "ScheduleLineItem_needsReview_idx" ON "ScheduleLineItem"("needsReview");

-- CreateIndex
CREATE INDEX "ProcurementPlan_buyerId_idx" ON "ProcurementPlan"("buyerId");

-- CreateIndex
CREATE INDEX "ProcurementPlan_projectId_idx" ON "ProcurementPlan"("projectId");

-- CreateIndex
CREATE INDEX "ProcurementPlan_status_idx" ON "ProcurementPlan"("status");

-- CreateIndex
CREATE INDEX "ProcurementPlan_createdAt_idx" ON "ProcurementPlan"("createdAt");

-- CreateIndex
CREATE INDEX "ProcurementTask_planId_idx" ON "ProcurementTask"("planId");

-- CreateIndex
CREATE INDEX "ProcurementTask_status_idx" ON "ProcurementTask"("status");

-- CreateIndex
CREATE INDEX "ProcurementTask_kind_idx" ON "ProcurementTask"("kind");

-- CreateIndex
CREATE INDEX "ProcurementTask_planId_status_idx" ON "ProcurementTask"("planId", "status");

-- CreateIndex
CREATE INDEX "ProcurementTask_dueDate_idx" ON "ProcurementTask"("dueDate");

-- CreateIndex
CREATE INDEX "PriceAlert_userId_idx" ON "PriceAlert"("userId");

-- CreateIndex
CREATE INDEX "PriceAlert_materialId_idx" ON "PriceAlert"("materialId");

-- CreateIndex
CREATE INDEX "PriceAlert_isActive_idx" ON "PriceAlert"("isActive");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "MaterialCategoryRef"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialVariant" ADD CONSTRAINT "MaterialVariant_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceObservation" ADD CONSTRAINT "PriceObservation_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceObservation" ADD CONSTRAINT "PriceObservation_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "MaterialVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceObservation" ADD CONSTRAINT "PriceObservation_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialPriceIndex" ADD CONSTRAINT "MaterialPriceIndex_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialPriceIndex" ADD CONSTRAINT "MaterialPriceIndex_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialSupplier" ADD CONSTRAINT "MaterialSupplier_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialSupplier" ADD CONSTRAINT "MaterialSupplier_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "MaterialVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialSupplier" ADD CONSTRAINT "MaterialSupplier_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostBenchmark" ADD CONSTRAINT "CostBenchmark_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEstimate" ADD CONSTRAINT "ProjectEstimate_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateLineItem" ADD CONSTRAINT "EstimateLineItem_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "ProjectEstimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateLineItem" ADD CONSTRAINT "EstimateLineItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialSchedule" ADD CONSTRAINT "MaterialSchedule_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialSchedule" ADD CONSTRAINT "MaterialSchedule_boqDocumentId_fkey" FOREIGN KEY ("boqDocumentId") REFERENCES "BOQDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleLineItem" ADD CONSTRAINT "ScheduleLineItem_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "MaterialSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleLineItem" ADD CONSTRAINT "ScheduleLineItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementPlan" ADD CONSTRAINT "ProcurementPlan_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "MaterialSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementTask" ADD CONSTRAINT "ProcurementTask_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ProcurementPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceAlert" ADD CONSTRAINT "PriceAlert_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
