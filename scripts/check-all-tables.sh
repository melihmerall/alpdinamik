#!/bin/bash
# Tüm tabloların kayıt sayılarını kontrol et

SITE_NAME="alpdinamik"
CONTAINER_NAME="${SITE_NAME}-postgres"

# .env.production'dan bilgileri oku
ENV_FILE="/var/www/$SITE_NAME/.env.production"
source $ENV_FILE

echo "📊 Tüm Tabloların Kayıt Sayıları"
echo "=================================="
echo ""

docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME << 'EOF'
SELECT 
    'representatives' as table_name, 
    COUNT(*) as count 
FROM representatives
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'banners', COUNT(*) FROM banners
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'sectors', COUNT(*) FROM sectors
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'reference_projects', COUNT(*) FROM reference_projects
UNION ALL
SELECT 'company_pages', COUNT(*) FROM company_pages
UNION ALL
SELECT 'content_blocks', COUNT(*) FROM content_blocks
UNION ALL
SELECT 'site_settings', COUNT(*) FROM site_settings
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'product_categories', COUNT(*) FROM product_categories
UNION ALL
SELECT 'product_series', COUNT(*) FROM product_series
UNION ALL
SELECT 'product_variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'product_images', COUNT(*) FROM product_images
ORDER BY count DESC;
EOF

echo ""
echo "✅ Kontrol tamamlandı!"

