#!/bin/bash

# Sunucuda database'i silip yeni dump ile oluşturma scripti

set -e

DUMP_FILE="${1:-alpdinamik-backup.sql}"

if [ ! -f "$DUMP_FILE" ]; then
    echo "❌ Hata: $DUMP_FILE dosyası bulunamadı!"
    echo "Kullanım: ./recreate-database.sh <dump-file.sql>"
    exit 1
fi

echo "🗑️  Mevcut database bağlantılarını kesiyoruz..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'alpdinamik_db' AND pid <> pg_backend_pid();
" > /dev/null 2>&1 || true

echo "🗑️  Mevcut database'i siliyoruz..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "DROP DATABASE IF EXISTS alpdinamik_db;" > /dev/null 2>&1 || true

echo "✅ Yeni database oluşturuluyor..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
CREATE DATABASE alpdinamik_db 
WITH TEMPLATE = template0 
ENCODING = 'UTF8' 
LOCALE_PROVIDER = libc 
LOCALE = 'en_US.utf8';
" > /dev/null 2>&1

echo "📥 Dump dosyasını temizleyip import ediyoruz..."
# DROP DATABASE, CREATE DATABASE ve \connect komutlarını atla
grep -v "^DROP DATABASE" "$DUMP_FILE" | \
grep -v "^CREATE DATABASE" | \
grep -v "^ALTER DATABASE.*OWNER" | \
grep -v "^\\\\connect" | \
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" 2>&1 | \
grep -v "ERROR.*role" | \
grep -v "ERROR.*already exists" || true

echo ""
echo "✅ Database başarıyla oluşturuldu ve import edildi!"

echo ""
echo "🔍 Kontrol ediyoruz..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "
SELECT 
    'representatives' as table_name, COUNT(*) as row_count FROM representatives
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'product_categories', COUNT(*) FROM product_categories
UNION ALL
SELECT 'product_series', COUNT(*) FROM product_series
UNION ALL
SELECT 'product_variants', COUNT(*) FROM product_variants;
"

echo ""
echo "✅ İşlem tamamlandı!"

