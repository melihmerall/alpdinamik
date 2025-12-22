#!/bin/bash
# Sunucuda çalıştırılacak deployment scripti

set -e

cd /var/www/alpdinamik

# docker-compose veya docker compose kontrolü
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    DOCKER_COMPOSE_CMD="docker compose"
fi

echo "🚀 Deployment başlıyor..."
echo ""

# 1. .env.production oluştur
if [ ! -f .env.production ]; then
    echo "📝 .env.production oluşturuluyor..."
    
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    cat > .env.production << EOF
SITE_NAME=alpdinamik
SITE_PORT=3001
DB_USER=alpdinamik_user
DB_PASSWORD=$DB_PASSWORD
DB_NAME=alpdinamik_db
DB_PORT=5432
DATABASE_URL=postgresql://alpdinamik_user:$DB_PASSWORD@alpdinamik-postgres:5432/alpdinamik_db?schema=public&connection_limit=20&pool_timeout=20
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=http://178.157.14.211:3001
NEXT_PUBLIC_API_URL=http://178.157.14.211:3001
NODE_ENV=production
EOF
    
    echo "✅ .env.production oluşturuldu"
    echo "🔑 DB_PASSWORD: $DB_PASSWORD"
    echo "🔑 NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
    echo ""
else
    echo "✅ .env.production zaten mevcut"
    echo ""
fi

# 2. Docker Compose ile container'ları başlat (önce database hazır olmalı)
echo "🐳 Docker Compose ile container'lar başlatılıyor..."
$DOCKER_COMPOSE_CMD -f docker-compose.prod.yml --env-file .env.production up -d --build

echo ""
echo "⏳ Database container'ının hazır olması bekleniyor (30 saniye)..."
sleep 30

# Database container'ının çalıştığını kontrol et
MAX_RETRIES=10
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker ps | grep -q "alpdinamik-postgres"; then
        echo "✅ Database container çalışıyor"
        break
    fi
    echo "⏳ Database container bekleniyor... ($((RETRY_COUNT + 1))/$MAX_RETRIES)"
    sleep 5
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "⚠️  Database container başlatılamadı, devam ediliyor..."
fi

# 3. Database import (eğer dump dosyası varsa)
if ls alpdinamik-dump-*.sql 1> /dev/null 2>&1; then
    DUMP_FILE=$(ls alpdinamik-dump-*.sql | head -1)
    echo ""
    echo "📥 Database import ediliyor: $DUMP_FILE"
    
    if [ -f import-database.sh ]; then
        chmod +x import-database.sh
        ./import-database.sh "$DUMP_FILE"
    else
        echo "⚠️  import-database.sh bulunamadı, manuel import gerekebilir"
        echo "💡 Manuel import için:"
        echo "   docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db < $DUMP_FILE"
    fi
    echo ""
fi

echo ""
echo "✅ Deployment tamamlandı!"
echo "🌐 Site: http://178.157.14.211:3001"
echo ""
echo "📊 Durum kontrolü:"
$DOCKER_COMPOSE_CMD -f docker-compose.prod.yml ps
echo ""
echo "📋 Logları görmek için:"
echo "   $DOCKER_COMPOSE_CMD -f docker-compose.prod.yml logs -f"

