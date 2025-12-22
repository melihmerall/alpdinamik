#!/bin/bash

# Database Bağlantı Sorununu Düzeltme Scripti

set -e

echo "🔧 Database Bağlantı Sorununu Düzeltiyoruz..."
echo ""

# 1. Container'ları durdur
echo "=== 1. Container'ları Durduruyoruz ==="
docker-compose -f docker-compose.prod.yml down
echo ""

# 2. .env.production kontrolü
echo "=== 2. .env.production Dosyası Kontrolü ==="
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production dosyası bulunamadı!"
    echo "📝 Örnek .env.production dosyası oluşturuluyor..."
    
    cat > .env.production << 'EOF'
# Database Configuration
DB_USER=alpdinamik_user
DB_PASSWORD=your_secure_password_here
DB_NAME=alpdinamik_db
DB_PORT=5432
DATABASE_URL=postgresql://alpdinamik_user:your_secure_password_here@alpdinamik-postgres:5432/alpdinamik_db?schema=public

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here_change_in_production
NEXTAUTH_URL=http://178.157.14.211:3001

# API Configuration
NEXT_PUBLIC_API_URL=http://178.157.14.211:3001

# Site Configuration
SITE_PORT=3001
EOF
    
    echo "⚠️  .env.production dosyası oluşturuldu!"
    echo "⚠️  LÜTFEN ŞİFRELERİ DEĞİŞTİRİN!"
    echo ""
    read -p "Şifreleri değiştirdiniz mi? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Lütfen .env.production dosyasındaki şifreleri değiştirin ve tekrar çalıştırın."
        exit 1
    fi
else
    echo "✅ .env.production dosyası mevcut"
fi
echo ""

# 3. Database volume kontrolü
echo "=== 3. Database Volume Kontrolü ==="
if docker volume ls | grep -q "alpdinamik-postgres-data"; then
    echo "✅ Database volume mevcut"
    VOLUME_SIZE=$(docker system df -v | grep "alpdinamik-postgres-data" | awk '{print $3}' || echo "bilinmiyor")
    echo "📊 Volume boyutu: $VOLUME_SIZE"
else
    echo "⚠️  Database volume bulunamadı, oluşturulacak"
fi
echo ""

# 4. Önce database container'ını başlat
echo "=== 4. Database Container'ını Başlatıyoruz ==="
docker-compose -f docker-compose.prod.yml up -d postgres
echo ""

# 5. Database'in hazır olmasını bekle
echo "=== 5. Database'in Hazır Olmasını Bekliyoruz ==="
echo "⏳ Database başlatılıyor (30 saniye bekleniyor)..."
sleep 30

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

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Database hazır olmadı, logları kontrol edin:"
    docker logs alpdinamik-postgres --tail 50
    exit 1
fi
echo ""

# 6. Database var mı kontrol et, yoksa oluştur
echo "=== 6. Database Kontrolü ve Oluşturma ==="
DB_EXISTS=$(docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='alpdinamik_db'" 2>/dev/null || echo "0")

if [ "$DB_EXISTS" != "1" ]; then
    echo "⚠️  alpdinamik_db database'i bulunamadı, oluşturuluyor..."
    docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "CREATE DATABASE alpdinamik_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';" 2>&1 || true
    echo "✅ Database oluşturuldu"
else
    echo "✅ alpdinamik_db database'i mevcut"
    
    # Tablo sayısını kontrol et
    TABLE_COUNT=$(docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null || echo "0")
    echo "📊 Tablo sayısı: $TABLE_COUNT"
    
    if [ "$TABLE_COUNT" = "0" ]; then
        echo "⚠️  Database boş, Prisma migration çalıştırılmalı"
    fi
fi
echo ""

# 7. App container'ını başlat
echo "=== 7. App Container'ını Başlatıyoruz ==="
docker-compose -f docker-compose.prod.yml up -d --build app
echo ""

# 8. Son durum
echo "=== 8. Son Durum ==="
docker-compose -f docker-compose.prod.yml ps
echo ""

echo "✅ İşlem tamamlandı!"
echo ""
echo "📝 Sonraki Adımlar:"
echo "1. Database boşsa, Prisma migration çalıştırın:"
echo "   docker exec alpdinamik-app npx prisma migrate deploy"
echo ""
echo "2. Veya database dump'ını import edin"
echo ""
echo "3. Logları kontrol edin:"
echo "   docker logs alpdinamik-app --tail 50"
echo "   docker logs alpdinamik-postgres --tail 50"

