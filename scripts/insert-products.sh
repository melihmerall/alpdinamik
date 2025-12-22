#!/bin/bash
# Product verilerini database'e ekleme scripti

set -e

SITE_NAME="alpdinamik"
CONTAINER_NAME="${SITE_NAME}-postgres"

echo "📦 Product Verileri Ekleniyor"
echo ""

# .env.production'dan bilgileri oku
ENV_FILE="/var/www/$SITE_NAME/.env.production"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env.production dosyası bulunamadı"
    exit 1
fi

source $ENV_FILE

# SQL dosyasını çalıştır
if [ -f "insert-products.sql" ]; then
    echo "📥 SQL dosyası çalıştırılıyor..."
    docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < insert-products.sql
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Product verileri başarıyla eklendi!"
        echo ""
        echo "🔍 Kontrol ediliyor..."
        docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "SELECT id, slug, name, \"isActive\" FROM products WHERE id IN ('cmixctpz40007fua8uz7iw60v', 'cmix69wg000034i2k04mgeq3j', 'cmj1gxqy600012970810i1u04', 'cmj1gzjm40005297052ee9101');"
    else
        echo "❌ Hata oluştu!"
        exit 1
    fi
else
    echo "❌ insert-products.sql dosyası bulunamadı!"
    exit 1
fi

echo ""
echo "✅ İşlem tamamlandı!"

