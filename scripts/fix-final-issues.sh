#!/bin/bash
# Import sonrası son düzeltmeler

set -e

SITE_NAME="alpdinamik"
CONTAINER_NAME="${SITE_NAME}-postgres"

echo "🔧 Son Düzeltmeler"
echo ""

# .env.production'dan bilgileri oku
ENV_FILE="/var/www/$SITE_NAME/.env.production"
source $ENV_FILE

echo "🔍 Foreign key sorunlarını düzeltiliyor..."

# Foreign key sorunlarını düzelt
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME << 'EOF'
-- Eksik product referanslı image'ları sil
DELETE FROM product_images 
WHERE "productId" NOT IN (SELECT id FROM products);

-- Eksik variant referanslı product'ları kontrol et
UPDATE products SET "variantId" = NULL 
WHERE "variantId" IS NOT NULL 
AND "variantId" NOT IN (SELECT id FROM product_variants);

-- Eksik series referanslı variant'ları kontrol et
UPDATE product_variants SET "seriesId" = NULL 
WHERE "seriesId" IS NOT NULL 
AND "seriesId" NOT IN (SELECT id FROM product_series);

-- Eksik category referanslı series'leri kontrol et
UPDATE product_series SET "categoryId" = NULL 
WHERE "categoryId" IS NOT NULL 
AND "categoryId" NOT IN (SELECT id FROM product_categories);
EOF

echo "✅ Foreign key sorunları düzeltildi"
echo ""

echo "📊 Database Özeti:"
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME << 'EOF'
SELECT 
    'representatives' as table_name, COUNT(*) as count FROM representatives
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'banners', COUNT(*) FROM banners
UNION ALL SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL SELECT 'sectors', COUNT(*) FROM sectors
UNION ALL SELECT 'services', COUNT(*) FROM services
UNION ALL SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL SELECT 'reference_projects', COUNT(*) FROM reference_projects
UNION ALL SELECT 'company_pages', COUNT(*) FROM company_pages
UNION ALL SELECT 'content_blocks', COUNT(*) FROM content_blocks
UNION ALL SELECT 'site_settings', COUNT(*) FROM site_settings
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'product_categories', COUNT(*) FROM product_categories
UNION ALL SELECT 'product_series', COUNT(*) FROM product_series
UNION ALL SELECT 'product_variants', COUNT(*) FROM product_variants
UNION ALL SELECT 'product_images', COUNT(*) FROM product_images
ORDER BY count DESC;
EOF

echo ""
echo "✅ İşlem tamamlandı!"

