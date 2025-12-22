#!/bin/bash

# Dump dosyasından database oluşturma scripti
# Kullanım: ./create-db-from-dump.sh <dump-file.sql>

set -e

DUMP_FILE="${1}"

if [ -z "$DUMP_FILE" ]; then
    echo "❌ Hata: Dump dosyası belirtilmedi!"
    echo "Kullanım: ./create-db-from-dump.sh <dump-file.sql>"
    exit 1
fi

if [ ! -f "$DUMP_FILE" ]; then
    echo "❌ Hata: $DUMP_FILE dosyası bulunamadı!"
    exit 1
fi

echo "🚀 Database oluşturma işlemi başlıyor..."
echo "📁 Dump dosyası: $DUMP_FILE"
echo ""

# 1. Mevcut bağlantıları kes
echo "🔌 Mevcut database bağlantılarını kesiyoruz..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'alpdinamik_db' AND pid <> pg_backend_pid();
" > /dev/null 2>&1 || true

# 2. Mevcut database'i sil
echo "🗑️  Mevcut database'i siliyoruz..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "DROP DATABASE IF EXISTS alpdinamik_db;" > /dev/null 2>&1 || true

# 3. Yeni database oluştur
echo "✅ Yeni database oluşturuluyor..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
CREATE DATABASE alpdinamik_db 
WITH TEMPLATE = template0 
ENCODING = 'UTF8' 
LOCALE_PROVIDER = libc 
LOCALE = 'en_US.utf8';
" > /dev/null 2>&1

# 4. Dump dosyasını temizle ve import et
echo "📥 Dump dosyası import ediliyor (bu biraz zaman alabilir)..."
grep -v "^DROP DATABASE" "$DUMP_FILE" | \
grep -v "^CREATE DATABASE" | \
grep -v "^ALTER DATABASE.*OWNER" | \
grep -v "^\\\\connect" | \
grep -v "^--" | \
grep -v "^$" | \
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" 2>&1 | \
grep -v "ERROR.*role" | \
grep -v "ERROR.*already exists" | \
grep -v "NOTICE" || true

echo ""
echo "✅ Database başarıyla oluşturuldu ve import edildi!"
echo ""

# 5. Kontrol
echo "🔍 Tablo kayıt sayılarını kontrol ediyoruz..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "
SELECT 
    'representatives' as tablo, COUNT(*) as kayit_sayisi FROM representatives
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'product_categories', COUNT(*) FROM product_categories
UNION ALL
SELECT 'product_series', COUNT(*) FROM product_series
UNION ALL
SELECT 'product_variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'banners', COUNT(*) FROM banners
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'sectors', COUNT(*) FROM sectors
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'users', COUNT(*) FROM users;
"

echo ""
echo "🎉 İşlem tamamlandı!"

