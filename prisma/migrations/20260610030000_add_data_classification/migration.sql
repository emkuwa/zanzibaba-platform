-- CreateEnum
CREATE TYPE "DataClassification" AS ENUM ('STRATEGIC_VERIFIED', 'DISCOVERED_VERIFIED', 'CLAIMED', 'TEST', 'SYNTHETIC');

-- AlterTable: DiscoveredLead
ALTER TABLE "DiscoveredLead" ADD COLUMN "dataClassification" "DataClassification" DEFAULT 'SYNTHETIC';

-- AlterTable: DirectoryEntity
ALTER TABLE "DirectoryEntity" ADD COLUMN "dataClassification" "DataClassification" DEFAULT 'SYNTHETIC';

-- AlterTable: SupplierProfile
ALTER TABLE "SupplierProfile" ADD COLUMN "dataClassification" "DataClassification" DEFAULT 'SYNTHETIC';
