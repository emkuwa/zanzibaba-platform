-- Drop old verificationTier column if it exists (was added manually without migration)
ALTER TABLE "DiscoveredLead" DROP COLUMN IF EXISTS "verificationTier";
ALTER TABLE "DirectoryEntity" DROP COLUMN IF EXISTS "verificationTier";
ALTER TABLE "SupplierProfile" DROP COLUMN IF EXISTS "verificationTier";

-- Add new verification fields to DiscoveredLead
ALTER TABLE "DiscoveredLead" ADD COLUMN IF NOT EXISTS "verifiedWebsite" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DiscoveredLead" ADD COLUMN IF NOT EXISTS "verifiedCompany" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DiscoveredLead" ADD COLUMN IF NOT EXISTS "verifiedExporter" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DiscoveredLead" ADD COLUMN IF NOT EXISTS "verificationScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "DiscoveredLead" ADD COLUMN IF NOT EXISTS "verificationNotes" TEXT;
ALTER TABLE "DiscoveredLead" ADD COLUMN IF NOT EXISTS "verifiedBy" TEXT;
ALTER TABLE "DiscoveredLead" ADD COLUMN IF NOT EXISTS "verifiedDate" TIMESTAMP(3);
ALTER TABLE "DiscoveredLead" ADD COLUMN IF NOT EXISTS "tier" TEXT;

-- Add new verification fields to DirectoryEntity
ALTER TABLE "DirectoryEntity" ADD COLUMN IF NOT EXISTS "verifiedWebsite" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DirectoryEntity" ADD COLUMN IF NOT EXISTS "verifiedCompany" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DirectoryEntity" ADD COLUMN IF NOT EXISTS "verifiedExporter" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DirectoryEntity" ADD COLUMN IF NOT EXISTS "verificationScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "DirectoryEntity" ADD COLUMN IF NOT EXISTS "tier" TEXT;

-- Add new verification fields to SupplierProfile
ALTER TABLE "SupplierProfile" ADD COLUMN IF NOT EXISTS "verifiedWebsite" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SupplierProfile" ADD COLUMN IF NOT EXISTS "verifiedCompany" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SupplierProfile" ADD COLUMN IF NOT EXISTS "verifiedExporter" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SupplierProfile" ADD COLUMN IF NOT EXISTS "verificationScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "SupplierProfile" ADD COLUMN IF NOT EXISTS "tier" TEXT;
