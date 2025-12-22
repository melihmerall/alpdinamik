#!/bin/bash

# Database Verilerini Kontrol Et

echo "🔍 Database Verilerini Kontrol Ediyoruz..."
echo ""

# Önemli tablolardaki kayıt sayıları
echo "=== Önemli Tablolardaki Kayıt Sayıları ==="

TABLES=("users" "representatives" "products" "banners" "blog_posts" "site_settings" "product_categories" "product_series" "product_variants")

for table in "${TABLES[@]}"; do
    COUNT=$(docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -tAc "SELECT COUNT(*) FROM \"$table\"" 2>/dev/null || echo "0")
    if [ "$COUNT" != "0" ]; then
        echo "✅ $table: $COUNT kayıt"
    else
        echo "⚠️  $table: $COUNT kayıt (boş)"
    fi
done
echo ""

# App container'dan database bağlantı testi
echo "=== App Container'dan Database Bağlantı Testi ==="
docker exec alpdinamik-app node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ Database bağlantısı başarılı!');
    return prisma.\$disconnect();
  })
  .catch((err) => {
    console.error('❌ Database bağlantı hatası:', err.message);
    process.exit(1);
  });
" 2>&1
echo ""

# Site çalışıyor mu?
echo "=== Site Health Check ==="
curl -s http://localhost:3001/api/health | head -5 || echo "❌ Site health check başarısız"
echo ""

echo "✅ Kontrol tamamlandı!"

