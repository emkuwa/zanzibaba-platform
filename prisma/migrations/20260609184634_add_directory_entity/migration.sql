-- CreateTable
CREATE TABLE "DirectoryEntity" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "profileModel" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryLabels" JSONB,
    "country" TEXT,
    "city" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "flexibleFields" JSONB,
    "membershipTier" "MembershipTier" NOT NULL DEFAULT 'FREE',
    "membershipExpiresAt" TIMESTAMP(3),
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationBadge" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredExpiresAt" TIMESTAMP(3),
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "activationStatus" "ActivationStatus" NOT NULL DEFAULT 'NONE',
    "claimToken" TEXT,
    "claimLinkSentAt" TIMESTAMP(3),
    "claimPageVisitedAt" TIMESTAMP(3),
    "claimedAt" TIMESTAMP(3),
    "claimedByUserId" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "featuredAt" TIMESTAMP(3),
    "discoveredLeadId" TEXT,
    "trustScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectoryEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DirectoryEntity_slug_key" ON "DirectoryEntity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DirectoryEntity_claimToken_key" ON "DirectoryEntity"("claimToken");

-- CreateIndex
CREATE UNIQUE INDEX "DirectoryEntity_entityType_entityId_key" ON "DirectoryEntity"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "DirectoryEntity_entityType_idx" ON "DirectoryEntity"("entityType");

-- CreateIndex
CREATE INDEX "DirectoryEntity_entityType_activationStatus_idx" ON "DirectoryEntity"("entityType", "activationStatus");

-- CreateIndex
CREATE INDEX "DirectoryEntity_entityType_verificationStatus_idx" ON "DirectoryEntity"("entityType", "verificationStatus");

-- CreateIndex
CREATE INDEX "DirectoryEntity_entityType_isFeatured_idx" ON "DirectoryEntity"("entityType", "isFeatured");

-- CreateIndex
CREATE INDEX "DirectoryEntity_country_city_idx" ON "DirectoryEntity"("country", "city");

-- CreateIndex
CREATE INDEX "DirectoryEntity_membershipTier_idx" ON "DirectoryEntity"("membershipTier");

-- CreateIndex
CREATE INDEX "DirectoryEntity_slug_idx" ON "DirectoryEntity"("slug");

-- CreateIndex
CREATE INDEX "DirectoryEntity_createdAt_idx" ON "DirectoryEntity"("createdAt");

-- CreateIndex
CREATE INDEX "DirectoryEntity_avgRating_idx" ON "DirectoryEntity"("avgRating");
