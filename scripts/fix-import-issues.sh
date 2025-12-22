#!/bin/bash
# Import sonrası sorunları düzelt

set -e

SITE_NAME="alpdinamik"
CONTAINER_NAME="${SITE_NAME}-postgres"

echo "🔧 Import Sorunlarını Düzeltme"
echo ""

# .env.production'dan bilgileri oku
ENV_FILE="/var/www/$SITE_NAME/.env.production"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env.production dosyası bulunamadı"
    exit 1
fi

source $ENV_FILE

echo "🔍 Database durumu kontrol ediliyor..."
echo ""

# 1. Tablo adlarını kontrol et (PostgreSQL küçük harf kullanıyor olabilir)
echo "📋 Mevcut tablolar:"
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "\dt" | head -30

echo ""
echo "🔍 Representative tablosunu kontrol ediliyor..."
REP_COUNT=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM representatives;" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$REP_COUNT" != "0" ] && [ -n "$REP_COUNT" ]; then
    echo "✅ Representatives tablosu bulundu! Kayıt sayısı: $REP_COUNT"
else
    echo "⚠️  Representatives tablosu bulunamadı veya boş"
    # Büyük harf ile dene
    REP_COUNT=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c 'SELECT COUNT(*) FROM "Representative";' 2>/dev/null | tr -d ' ' || echo "0")
    if [ "$REP_COUNT" != "0" ]; then
        echo "✅ Representative tablosu bulundu! Kayıt sayısı: $REP_COUNT"
    fi
fi

echo ""
echo "🔍 Foreign key sorunlarını kontrol ediliyor..."

# 2. Foreign key constraint sorunlarını düzelt
echo "🔧 Eksik product referanslarını temizle..."
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
echo "📊 Database özeti:"
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
SELECT 'services', COUNT(*) FROM services;
EOF

echo ""
echo "✅ Kontrol tamamlandı!"

