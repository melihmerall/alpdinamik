#!/bin/bash

# Database Bağlantı Sorununu Kontrol Et

echo "🔍 Database Bağlantı Sorununu Kontrol Ediyoruz..."
echo ""

# 1. Container durumu
echo "=== 1. Container Durumu ==="
docker ps | grep alpdinamik
echo ""

# 2. .env.production kontrolü
echo "=== 2. .env.production Dosyası ==="
if [ -f ".env.production" ]; then
    echo "✅ .env.production mevcut"
    echo "DATABASE_URL var mı?"
    grep -q "DATABASE_URL" .env.production && echo "✅ DATABASE_URL mevcut" || echo "❌ DATABASE_URL yok!"
    echo ""
    echo "DATABASE_URL değeri (ilk 50 karakter):"
    grep "^DATABASE_URL=" .env.production | cut -c1-50 || echo "❌ DATABASE_URL bulunamadı"
else
    echo "❌ .env.production dosyası bulunamadı!"
fi
echo ""

# 3. App container environment variables
echo "=== 3. App Container Environment Variables ==="
echo "DATABASE_URL:"
docker exec alpdinamik-app env | grep DATABASE_URL || echo "❌ DATABASE_URL container'da yok!"
echo ""

# 4. Database container hazır mı?
echo "=== 4. Database Container Hazır mı? ==="
docker exec alpdinamik-postgres pg_isready -U alpdinamik_user && echo "✅ Database hazır" || echo "❌ Database hazır değil"
echo ""

# 5. Prisma bağlantı testi
echo "=== 5. Prisma Bağlantı Testi ==="
docker exec alpdinamik-app node -e 'const { PrismaClient } = require("@prisma/client"); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log("✅ Bağlantı başarılı!"); prisma.$disconnect(); }).catch(err => { console.error("❌ Hata:", err.message); });' 2>&1
echo ""

echo "✅ Kontrol tamamlandı!"

