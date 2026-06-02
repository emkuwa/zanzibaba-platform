-- CreateEnum
CREATE TYPE "ActivationStatus" AS ENUM ('NONE', 'UNCLAIMED', 'CLAIMED', 'VERIFIED', 'FEATURED');

-- CreateEnum
CREATE TYPE "FoundingStage" AS ENUM ('INVITED', 'CLAIMED', 'VERIFIED', 'FEATURED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('DISCOVERED', 'VERIFIED', 'REVIEW_PENDING', 'APPROVED', 'REJECTED', 'IMPORTED', 'MERGED');

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "ProfessionalType" AS ENUM ('ARCHITECT', 'ENGINEER', 'SURVEYOR');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "RFQStatus" AS ENUM ('DRAFT', 'OPEN', 'QUOTING', 'AWARDED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScoutType" AS ENUM ('SUPPLIER', 'CONTRACTOR', 'PROFESSIONAL', 'PRODUCT', 'OUTREACH', 'VERIFICATION', 'PROJECT', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "TrustLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BUYER', 'SUPPLIER', 'CONTRACTOR', 'PROFESSIONAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED');

-- CreateEnum
CREATE TYPE "WhatsAppStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLAIMED', 'FAILED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "companyRegistration" TEXT,
    "taxId" TEXT,
    "businessType" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "imageUrl" TEXT,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "taxId" TEXT,
    "licenseNumber" TEXT,
    "licenseDocumentUrl" TEXT,
    "insuranceDocumentUrl" TEXT,
    "companyLogoUrl" TEXT,
    "coverImageUrl" TEXT,
    "companyDescription" TEXT,
    "yearEstablished" INTEGER,
    "teamSize" INTEGER,
    "specialties" JSONB,
    "completedProjects" INTEGER NOT NULL DEFAULT 0,
    "country" TEXT NOT NULL DEFAULT 'Tanzania',
    "city" TEXT,
    "address" TEXT,
    "serviceAreas" JSONB,
    "website" TEXT,
    "whatsappNumber" TEXT,
    "membershipTier" "MembershipTier" NOT NULL DEFAULT 'FREE',
    "membershipExpiresAt" TIMESTAMP(3),
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationBadge" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "leadCount" INTEGER NOT NULL DEFAULT 0,
    "responseRate" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "avgRating" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscoveredLead" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "scoutRunId" TEXT,
    "sourceUrl" TEXT,
    "sourcePlatform" TEXT,
    "leadType" TEXT NOT NULL,
    "companyName" TEXT,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "location" TEXT,
    "country" TEXT,
    "city" TEXT,
    "description" TEXT,
    "categorySlug" TEXT,
    "categoryLabels" JSONB,
    "products" JSONB,
    "socialProfiles" JSONB,
    "verificationData" JSONB,
    "trustScore" INTEGER NOT NULL DEFAULT 0,
    "trustLevel" "TrustLevel" NOT NULL DEFAULT 'LOW',
    "status" "LeadStatus" NOT NULL DEFAULT 'DISCOVERED',
    "duplicateOf" TEXT,
    "duplicateScore" INTEGER,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "importedAt" TIMESTAMP(3),
    "importedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activationStatus" "ActivationStatus" NOT NULL DEFAULT 'NONE',
    "claimLinkSentAt" TIMESTAMP(3),
    "claimToken" TEXT,
    "claimedAt" TIMESTAMP(3),
    "claimedByEmail" TEXT,
    "claimedByUserId" TEXT,
    "featuredAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "facebookUrl" TEXT,
    "followers" INTEGER,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "sources" JSONB,

    CONSTRAINT "DiscoveredLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoundingSupplier" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "stage" "FoundingStage" NOT NULL DEFAULT 'INVITED',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "featuredAt" TIMESTAMP(3),
    "campaign" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoundingSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthAgent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ScoutType" NOT NULL,
    "description" TEXT,
    "config" JSONB,
    "schedule" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "totalRuns" INTEGER NOT NULL DEFAULT 0,
    "totalLeads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "rfqId" TEXT,
    "orderId" TEXT,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "attachments" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT,
    "buyerId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "OrderStatus" NOT NULL DEFAULT 'CONFIRMED',
    "shippingAddress" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "trackingInfo" TEXT,
    "paymentStatus" TEXT,
    "paymentMethod" TEXT,
    "transactionFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "platformFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "specifications" JSONB,
    "price" DECIMAL(65,30),
    "priceCurrency" TEXT NOT NULL DEFAULT 'USD',
    "moq" INTEGER,
    "unit" TEXT,
    "images" JSONB,
    "videoUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "inquiryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "professionalType" "ProfessionalType" NOT NULL,
    "fullName" TEXT NOT NULL,
    "title" TEXT,
    "licenseNumber" TEXT,
    "certifications" JSONB,
    "education" TEXT,
    "profileImageUrl" TEXT,
    "coverImageUrl" TEXT,
    "bio" TEXT,
    "yearExperience" INTEGER,
    "country" TEXT NOT NULL DEFAULT 'Tanzania',
    "city" TEXT,
    "website" TEXT,
    "whatsappNumber" TEXT,
    "membershipTier" "MembershipTier" NOT NULL DEFAULT 'FREE',
    "membershipExpiresAt" TIMESTAMP(3),
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationBadge" BOOLEAN NOT NULL DEFAULT false,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "leadCount" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "projectType" TEXT,
    "category" TEXT,
    "budget" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "location" TEXT,
    "timelineStart" TIMESTAMP(3),
    "timelineEnd" TIMESTAMP(3),
    "documents" JSONB,
    "images" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "deliveryTimeline" TEXT,
    "paymentTerms" TEXT,
    "notes" TEXT,
    "documents" JSONB,
    "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RFQ" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "documents" JSONB,
    "budgetMin" DECIMAL(65,30),
    "budgetMax" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "quantity" INTEGER,
    "unit" TEXT,
    "deliveryLocation" TEXT,
    "deliveryTimeline" TEXT,
    "status" "RFQStatus" NOT NULL DEFAULT 'OPEN',
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "invitedSuppliers" JSONB,
    "responseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RFQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeType" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "orderId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "images" JSONB,
    "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutRun" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'running',
    "recordsFound" INTEGER NOT NULL DEFAULT 0,
    "recordsScored" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "log" TEXT,
    "duration" INTEGER,

    CONSTRAINT "ScoutRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileType" TEXT NOT NULL,
    "tier" "MembershipTier" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "interval" TEXT NOT NULL DEFAULT 'monthly',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "taxId" TEXT,
    "licenseDocumentUrl" TEXT,
    "taxDocumentUrl" TEXT,
    "companyLogoUrl" TEXT,
    "coverImageUrl" TEXT,
    "companyDescription" TEXT,
    "yearEstablished" INTEGER,
    "employeeCount" INTEGER,
    "country" TEXT NOT NULL DEFAULT 'Tanzania',
    "city" TEXT,
    "address" TEXT,
    "serviceAreas" JSONB,
    "website" TEXT,
    "whatsappNumber" TEXT,
    "membershipTier" "MembershipTier" NOT NULL DEFAULT 'FREE',
    "membershipExpiresAt" TIMESTAMP(3),
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationBadge" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredExpiresAt" TIMESTAMP(3),
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "leadCount" INTEGER NOT NULL DEFAULT 0,
    "responseRate" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "avgRating" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT,
    "paymentProvider" TEXT,
    "paymentId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'BUYER',
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileType" TEXT NOT NULL,
    "documents" JSONB,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "WhatsAppMessage" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'whatsapp',
    "messageType" TEXT NOT NULL DEFAULT 'activation',
    "status" "WhatsAppStatus" NOT NULL DEFAULT 'PENDING',
    "claimLink" TEXT,
    "content" TEXT,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "claimedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorLog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider" ASC, "providerAccountId" ASC);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_entityType_entityId_idx" ON "AnalyticsEvent"("entityType" ASC, "entityId" ASC);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventType_idx" ON "AnalyticsEvent"("eventType" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "BuyerProfile_userId_key" ON "BuyerProfile"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ContractorProfile_userId_key" ON "ContractorProfile"("userId" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_activationStatus_idx" ON "DiscoveredLead"("activationStatus" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_activationStatus_status_idx" ON "DiscoveredLead"("activationStatus" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_agentId_idx" ON "DiscoveredLead"("agentId" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_categorySlug_idx" ON "DiscoveredLead"("categorySlug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "DiscoveredLead_claimToken_key" ON "DiscoveredLead"("claimToken" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_companyName_idx" ON "DiscoveredLead"("companyName" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_country_idx" ON "DiscoveredLead"("country" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_email_idx" ON "DiscoveredLead"("email" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_facebookUrl_idx" ON "DiscoveredLead"("facebookUrl" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_instagramUrl_idx" ON "DiscoveredLead"("instagramUrl" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_leadType_idx" ON "DiscoveredLead"("leadType" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_linkedinUrl_idx" ON "DiscoveredLead"("linkedinUrl" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_status_idx" ON "DiscoveredLead"("status" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_status_trustLevel_idx" ON "DiscoveredLead"("status" ASC, "trustLevel" ASC);

-- CreateIndex
CREATE INDEX "DiscoveredLead_trustLevel_idx" ON "DiscoveredLead"("trustLevel" ASC);

-- CreateIndex
CREATE INDEX "FoundingSupplier_campaign_idx" ON "FoundingSupplier"("campaign" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "FoundingSupplier_leadId_key" ON "FoundingSupplier"("leadId" ASC);

-- CreateIndex
CREATE INDEX "FoundingSupplier_stage_campaign_idx" ON "FoundingSupplier"("stage" ASC, "campaign" ASC);

-- CreateIndex
CREATE INDEX "FoundingSupplier_stage_idx" ON "FoundingSupplier"("stage" ASC);

-- CreateIndex
CREATE INDEX "GrowthAgent_isActive_idx" ON "GrowthAgent"("isActive" ASC);

-- CreateIndex
CREATE INDEX "GrowthAgent_type_idx" ON "GrowthAgent"("type" ASC);

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Message_isRead_idx" ON "Message"("isRead" ASC);

-- CreateIndex
CREATE INDEX "Message_orderId_idx" ON "Message"("orderId" ASC);

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId" ASC);

-- CreateIndex
CREATE INDEX "Message_rfqId_idx" ON "Message"("rfqId" ASC);

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId" ASC);

-- CreateIndex
CREATE INDEX "Order_buyerId_idx" ON "Order"("buyerId" ASC);

-- CreateIndex
CREATE INDEX "Order_buyerId_status_idx" ON "Order"("buyerId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber" ASC);

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus" ASC);

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status" ASC);

-- CreateIndex
CREATE INDEX "Order_supplierId_idx" ON "Order"("supplierId" ASC);

-- CreateIndex
CREATE INDEX "Order_supplierId_status_idx" ON "Order"("supplierId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId" ASC);

-- CreateIndex
CREATE INDEX "Product_categoryId_isActive_idx" ON "Product"("categoryId" ASC, "isActive" ASC);

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive" ASC);

-- CreateIndex
CREATE INDEX "Product_isFeatured_idx" ON "Product"("isFeatured" ASC);

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug" ASC);

-- CreateIndex
CREATE INDEX "Product_supplierId_idx" ON "Product"("supplierId" ASC);

-- CreateIndex
CREATE INDEX "Product_supplierId_isActive_idx" ON "Product"("supplierId" ASC, "isActive" ASC);

-- CreateIndex
CREATE INDEX "ProfessionalProfile_city_idx" ON "ProfessionalProfile"("city" ASC);

-- CreateIndex
CREATE INDEX "ProfessionalProfile_createdAt_idx" ON "ProfessionalProfile"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "ProfessionalProfile_professionalType_idx" ON "ProfessionalProfile"("professionalType" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalProfile_userId_key" ON "ProfessionalProfile"("userId" ASC);

-- CreateIndex
CREATE INDEX "ProfessionalProfile_verificationStatus_idx" ON "ProfessionalProfile"("verificationStatus" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug" ASC);

-- CreateIndex
CREATE INDEX "Quote_rfqId_idx" ON "Quote"("rfqId" ASC);

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status" ASC);

-- CreateIndex
CREATE INDEX "Quote_supplierId_idx" ON "Quote"("supplierId" ASC);

-- CreateIndex
CREATE INDEX "RFQ_buyerId_idx" ON "RFQ"("buyerId" ASC);

-- CreateIndex
CREATE INDEX "RFQ_categoryId_idx" ON "RFQ"("categoryId" ASC);

-- CreateIndex
CREATE INDEX "RFQ_createdAt_idx" ON "RFQ"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "RFQ_status_createdAt_idx" ON "RFQ"("status" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "RFQ_status_idx" ON "RFQ"("status" ASC);

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Review_isApproved_idx" ON "Review"("isApproved" ASC);

-- CreateIndex
CREATE INDEX "Review_orderId_idx" ON "Review"("orderId" ASC);

-- CreateIndex
CREATE INDEX "Review_revieweeType_revieweeId_idx" ON "Review"("revieweeType" ASC, "revieweeId" ASC);

-- CreateIndex
CREATE INDEX "Review_reviewerId_idx" ON "Review"("reviewerId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SavedItem_userId_itemType_itemId_key" ON "SavedItem"("userId" ASC, "itemType" ASC, "itemId" ASC);

-- CreateIndex
CREATE INDEX "ScoutRun_agentId_idx" ON "ScoutRun"("agentId" ASC);

-- CreateIndex
CREATE INDEX "ScoutRun_startedAt_idx" ON "ScoutRun"("startedAt" ASC);

-- CreateIndex
CREATE INDEX "ScoutRun_status_idx" ON "ScoutRun"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken" ASC);

-- CreateIndex
CREATE INDEX "SupplierProfile_avgRating_idx" ON "SupplierProfile"("avgRating" ASC);

-- CreateIndex
CREATE INDEX "SupplierProfile_city_country_idx" ON "SupplierProfile"("city" ASC, "country" ASC);

-- CreateIndex
CREATE INDEX "SupplierProfile_city_idx" ON "SupplierProfile"("city" ASC);

-- CreateIndex
CREATE INDEX "SupplierProfile_country_idx" ON "SupplierProfile"("country" ASC);

-- CreateIndex
CREATE INDEX "SupplierProfile_createdAt_idx" ON "SupplierProfile"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "SupplierProfile_isFeatured_idx" ON "SupplierProfile"("isFeatured" ASC);

-- CreateIndex
CREATE INDEX "SupplierProfile_membershipTier_idx" ON "SupplierProfile"("membershipTier" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProfile_userId_key" ON "SupplierProfile"("userId" ASC);

-- CreateIndex
CREATE INDEX "SupplierProfile_verificationStatus_idx" ON "SupplierProfile"("verificationStatus" ASC);

-- CreateIndex
CREATE INDEX "SupplierProfile_verificationStatus_isFeatured_idx" ON "SupplierProfile"("verificationStatus" ASC, "isFeatured" ASC);

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Transaction_orderId_idx" ON "Transaction"("orderId" ASC);

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status" ASC);

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type" ASC);

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier" ASC, "token" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token" ASC);

-- CreateIndex
CREATE INDEX "WhatsAppMessage_leadId_idx" ON "WhatsAppMessage"("leadId" ASC);

-- CreateIndex
CREATE INDEX "WhatsAppMessage_messageType_idx" ON "WhatsAppMessage"("messageType" ASC);

-- CreateIndex
CREATE INDEX "WhatsAppMessage_status_idx" ON "WhatsAppMessage"("status" ASC);

-- CreateIndex
CREATE INDEX "WhatsAppMessage_status_leadId_idx" ON "WhatsAppMessage"("status" ASC, "leadId" ASC);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerProfile" ADD CONSTRAINT "BuyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractorProfile" ADD CONSTRAINT "ContractorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscoveredLead" ADD CONSTRAINT "DiscoveredLead_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "GrowthAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscoveredLead" ADD CONSTRAINT "DiscoveredLead_scoutRunId_fkey" FOREIGN KEY ("scoutRunId") REFERENCES "ScoutRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundingSupplier" ADD CONSTRAINT "FoundingSupplier_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "DiscoveredLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "SupplierProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "SupplierProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "RFQ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "SupplierProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQ" ADD CONSTRAINT "RFQ_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQ" ADD CONSTRAINT "RFQ_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutRun" ADD CONSTRAINT "ScoutRun_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "GrowthAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProfile" ADD CONSTRAINT "SupplierProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "DiscoveredLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

