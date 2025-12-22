#!/bin/bash

# Database İçeriğini Kontrol Et

echo "🔍 Database Container ve İçeriğini Kontrol Ediyoruz..."
echo ""

# 0. Container durumu
echo "=== 0. Container Durumu ==="
if docker ps | grep -q "alpdinamik-postgres"; then
    echo "✅ Database container çalışıyor"
    CONTAINER_STATUS=$(docker ps --format "{{.Status}}" --filter "name=alpdinamik-postgres")
    echo "📊 Durum: $CONTAINER_STATUS"
else
    echo "❌ Database container çalışmıyor!"
    exit 1
fi
echo ""

# 1. Database bağlantı testi
echo "=== 1. Database Bağlantı Testi ==="
if docker exec alpdinamik-postgres pg_isready -U alpdinamik_user > /dev/null 2>&1; then
    echo "✅ Database hazır ve bağlantı kabul ediyor"
else
    echo "❌ Database hazır değil!"
    exit 1
fi
echo ""

# 2. Database var mı kontrol et
echo "=== 2. Database Varlık Kontrolü ==="
DB_EXISTS=$(docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='alpdinamik_db'" 2>/dev/null || echo "0")
if [ "$DB_EXISTS" = "1" ]; then
    echo "✅ alpdinamik_db database'i mevcut"
else
    echo "❌ alpdinamik_db database'i bulunamadı!"
    exit 1
fi
echo ""

# 3. Tablo sayısı
echo "=== 3. Tablo Sayısı ==="
TABLE_COUNT=$(docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null || echo "0")
echo "📊 Tablo sayısı: $TABLE_COUNT"
if [ "$TABLE_COUNT" = "0" ]; then
    echo "⚠️  Database boş! Tablolar yok."
    echo "💡 Prisma migration çalıştırmanız veya SQL dump import etmeniz gerekiyor."
else
    echo "✅ Database'de tablolar mevcut"
fi
echo ""

# 4. Tablo listesi
echo "=== 4. Tablo Listesi ==="
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "\dt" 2>&1
echo ""

# 5. Önemli tablolardaki kayıt sayıları
if [ "$TABLE_COUNT" != "0" ]; then
    echo "=== 5. Önemli Tablolardaki Kayıt Sayıları ==="
    
    TABLES=("users" "representatives" "products" "banners" "blog_posts" "site_settings")
    
    for table in "${TABLES[@]}"; do
        COUNT=$(docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -tAc "SELECT COUNT(*) FROM \"$table\"" 2>/dev/null || echo "tablo yok")
        echo "📊 $table: $COUNT"
    done
    echo ""
else
    echo "=== 5. Database Boş - Tablo Kontrolü Atlandı ==="
    echo ""
fi

# 6. App container'dan database bağlantı testi
echo "=== 6. App Container'dan Database Bağlantı Testi ==="
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

# 7. Environment variables kontrolü
echo "=== 7. App Container Environment Variables ==="
docker exec alpdinamik-app env | grep -E "DATABASE_URL|NEXTAUTH" | sed 's/=.*/=***/' || echo "❌ Environment variables bulunamadı"
echo ""

echo "✅ Kontrol tamamlandı!"

