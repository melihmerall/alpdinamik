-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "company_pages" ADD COLUMN     "certificationImageUrl" TEXT,
ADD COLUMN     "certificationStat1Label" TEXT,
ADD COLUMN     "certificationStat1Number" INTEGER,
ADD COLUMN     "certificationStat2Label" TEXT,
ADD COLUMN     "certificationStat2Number" INTEGER,
ADD COLUMN     "certificationStat3Label" TEXT,
ADD COLUMN     "certificationStat3Number" INTEGER,
ADD COLUMN     "certificationStat4Label" TEXT,
ADD COLUMN     "certificationStat4Number" INTEGER,
ADD COLUMN     "certificationSubtitle" TEXT,
ADD COLUMN     "certificationTitle" TEXT,
ADD COLUMN     "image2Url" TEXT,
ADD COLUMN     "missionBody" TEXT,
ADD COLUMN     "missionImageUrl" TEXT,
ADD COLUMN     "missionSubtitle" TEXT,
ADD COLUMN     "missionTitle" TEXT,
ADD COLUMN     "teamSubtitle" TEXT,
ADD COLUMN     "teamTitle" TEXT,
ADD COLUMN     "videoBackgroundImageUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "visionBody" TEXT,
ADD COLUMN     "visionImageUrl" TEXT,
ADD COLUMN     "visionSubtitle" TEXT,
ADD COLUMN     "visionTitle" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "externalProductUrl" TEXT,
ADD COLUMN     "file2dUrl" TEXT,
ADD COLUMN     "file3dUrl" TEXT,
ADD COLUMN     "infoImageUrl" TEXT;

-- CreateTable
CREATE TABLE "application_showcases" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT,
    "imageUrl" TEXT,
    "breadcrumbImageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_showcases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "defaultBreadcrumbImageUrl" TEXT,
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "youtubeUrl" TEXT,
    "behanceUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "mapEmbedUrl" TEXT,
    "siteName" TEXT,
    "siteDescription" TEXT,
    "smtpHost" TEXT,
    "smtpPort" INTEGER,
    "smtpUser" TEXT,
    "smtpPassword" TEXT,
    "smtpSecure" BOOLEAN NOT NULL DEFAULT true,
    "contactEmail" TEXT,
    "kvkkText" TEXT,
    "contactFormTitle" TEXT,
    "contactFormSubtitle" TEXT,
    "contactFormNote" TEXT,
    "faviconUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_showcases_slug_key" ON "application_showcases"("slug");

-- CreateIndex
CREATE INDEX "application_showcases_isActive_order_idx" ON "application_showcases"("isActive", "order");

-- CreateIndex
CREATE INDEX "application_showcases_slug_idx" ON "application_showcases"("slug");

-- CreateIndex
CREATE INDEX "banners_isActive_order_idx" ON "banners"("isActive", "order");

-- CreateIndex
CREATE INDEX "blog_posts_isPublished_publishedAt_idx" ON "blog_posts"("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "product_categories_representativeId_isActive_order_idx" ON "product_categories"("representativeId", "isActive", "order");

-- CreateIndex
CREATE INDEX "product_series_categoryId_isActive_order_idx" ON "product_series"("categoryId", "isActive", "order");

-- CreateIndex
CREATE INDEX "product_variants_seriesId_isActive_order_idx" ON "product_variants"("seriesId", "isActive", "order");

-- CreateIndex
CREATE INDEX "products_representativeId_isActive_order_idx" ON "products"("representativeId", "isActive", "order");

-- CreateIndex
CREATE INDEX "products_categoryId_isActive_order_idx" ON "products"("categoryId", "isActive", "order");

-- CreateIndex
CREATE INDEX "products_seriesId_isActive_order_idx" ON "products"("seriesId", "isActive", "order");

-- CreateIndex
CREATE INDEX "products_variantId_isActive_order_idx" ON "products"("variantId", "isActive", "order");

-- CreateIndex
CREATE INDEX "representatives_isActive_order_idx" ON "representatives"("isActive", "order");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
