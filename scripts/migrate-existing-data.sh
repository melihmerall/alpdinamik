#!/bin/bash

# Mevcut Verileri Yeni Docker Ortamına Taşıma Script'i
# Bu script, mevcut veritabanı verilerini yeni Docker container'ına taşır

set -e

echo "🔄 Mevcut Verileri Yeni Docker Ortamına Taşıma..."
echo ""

# .env.production dosyası var mı?
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production dosyası bulunamadı!"
    echo "Lütfen önce .env.production dosyasını oluşturun."
    exit 1
fi

# Environment variables'ları yükle
export $(cat .env.production | grep -v '^#' | xargs)

DB_USER=${DB_USER:-alpdinamik}
DB_NAME=${DB_NAME:-alpdinamik_db}
DB_PASSWORD=${DB_PASSWORD}

# Mevcut veritabanından yedek al
echo "📦 Mevcut veritabanından yedek alınıyor..."

# Eski container'dan yedek al (eğer varsa)
OLD_CONTAINER=$(docker ps -a --filter "name=alpdinamik-db" --format "{{.Names}}" | head -n 1)

if [ ! -z "$OLD_CONTAINER" ]; then
    echo "✅ Eski container bulundu: $OLD_CONTAINER"
    
    # Container çalışıyor mu?
    if [ "$(docker inspect -f '{{.State.Running}}' $OLD_CONTAINER)" = "true" ]; then
        echo "📥 Eski container'dan yedek alınıyor..."
        mkdir -p backups
        BACKUP_FILE="backups/migration_backup_$(date +%Y%m%d_%H%M%S).sql"
        
        docker exec $OLD_CONTAINER pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE 2>/dev/null || \
        docker exec $OLD_CONTAINER PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE
        
        echo "✅ Yedek alındı: $BACKUP_FILE"
        
        # Yeni container'ı başlat
        echo "🚀 Yeni Docker container'ları başlatılıyor..."
        docker-compose -f docker-compose.prod.yml up -d postgres
        
        # Veritabanının hazır olmasını bekle
        echo "⏳ Veritabanının hazır olması bekleniyor..."
        sleep 10
        
        # Yedeği yeni container'a yükle
        echo "📤 Yedek yeni container'a yükleniyor..."
        docker-compose -f docker-compose.prod.yml exec -T postgres \
            PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME < $BACKUP_FILE
        
        echo "✅ Veriler yeni container'a taşındı!"
    else
        echo "⚠️  Eski container çalışmıyor. Manuel yedek almanız gerekebilir."
    fi
else
    echo "ℹ️  Eski container bulunamadı. Yeni kurulum yapılacak."
fi

# Migration'ları çalıştır
echo "🗄️  Database migration'ları çalıştırılıyor..."
docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy || \
docker-compose -f docker-compose.prod.yml exec -T app npx prisma db push --accept-data-loss

echo ""
echo "✅ Veri migration tamamlandı!"

