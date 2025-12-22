#!/bin/bash

# Database Bağlantı Sorununu Kesin Çözüm

set -e

echo "🔧 Database Bağlantı Sorununu Kesin Çözüm..."
echo ""

# 1. .env.production kontrolü
echo "=== 1. .env.production Kontrolü ==="
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production dosyası bulunamadı!"
    exit 1
fi

# DATABASE_URL kontrolü
if ! grep -q "^DATABASE_URL=" .env.production; then
    echo "❌ DATABASE_URL .env.production'da yok!"
    echo "📝 DATABASE_URL ekleniyor..."
    
    # .env.production'dan diğer değerleri al
    DB_USER=$(grep "^DB_USER=" .env.production | cut -d'=' -f2 || echo "alpdinamik_user")
    DB_PASSWORD=$(grep "^DB_PASSWORD=" .env.production | cut -d'=' -f2 || echo "")
    DB_NAME=$(grep "^DB_NAME=" .env.production | cut -d'=' -f2 || echo "alpdinamik_db")
    
    if [ -z "$DB_PASSWORD" ]; then
        echo "❌ DB_PASSWORD boş! Lütfen .env.production dosyasını düzenleyin."
        exit 1
    fi
    
    # DATABASE_URL ekle
    echo "" >> .env.production
    echo "DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@alpdinamik-postgres:5432/${DB_NAME}?schema=public" >> .env.production
    echo "✅ DATABASE_URL eklendi"
else
    echo "✅ DATABASE_URL mevcut"
fi
echo ""

# 2. Container'ı durdur
echo "=== 2. Container'ları Durduruyoruz ==="
docker-compose -f docker-compose.prod.yml down
echo ""

# 3. Container'ı --env-file ile başlat
echo "=== 3. Container'ları --env-file ile Başlatıyoruz ==="
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
echo ""

# 4. Container'ların hazır olmasını bekle
echo "=== 4. Container'ların Hazır Olmasını Bekliyoruz ==="
echo "⏳ 30 saniye bekleniyor..."
sleep 30

# Database hazır mı kontrol et
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker exec alpdinamik-postgres pg_isready -U alpdinamik_user > /dev/null 2>&1; then
        echo "✅ Database hazır!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Bekleniyor... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done
echo ""

# 5. App container DATABASE_URL kontrolü
echo "=== 5. App Container DATABASE_URL Kontrolü ==="
DATABASE_URL_IN_CONTAINER=$(docker exec alpdinamik-app env | grep "^DATABASE_URL=" | cut -d'=' -f2- || echo "")
if [ -z "$DATABASE_URL_IN_CONTAINER" ]; then
    echo "❌ DATABASE_URL hala container'da yok!"
    echo "⚠️  Manuel olarak environment variable eklemeniz gerekebilir"
else
    echo "✅ DATABASE_URL container'da mevcut"
    echo "📝 İlk 50 karakter: ${DATABASE_URL_IN_CONTAINER:0:50}..."
fi
echo ""

# 6. Prisma bağlantı testi
echo "=== 6. Prisma Bağlantı Testi ==="
docker exec alpdinamik-app node -e 'const { PrismaClient } = require("@prisma/client"); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log("✅ Bağlantı başarılı!"); prisma.$disconnect(); }).catch(err => { console.error("❌ Hata:", err.message); process.exit(1); });' 2>&1
echo ""

echo "✅ İşlem tamamlandı!"

