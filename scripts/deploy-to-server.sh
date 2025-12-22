#!/bin/bash

# Alpdinamik - Sunucuya Deployment Script
# Bu script projeyi sunucuya aktarır ve çalıştırır

set -e

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Sunucu bilgileri
SERVER_HOST="178.157.14.211"
SERVER_PORT="23422"
SERVER_USER="root"
SERVER_DIR="/var/www/alpdinamik"
LOCAL_DIR="."

echo -e "${BLUE}🚀 Alpdinamik - Sunucuya Deployment${NC}"
echo -e "${YELLOW}📍 Sunucu: $SERVER_USER@$SERVER_HOST:$SERVER_PORT${NC}"
echo -e "${YELLOW}📁 Hedef Klasör: $SERVER_DIR${NC}"
echo ""

# 1. Proje dosyalarını sunucuya aktar
echo -e "${YELLOW}📤 Proje dosyaları sunucuya aktarılıyor...${NC}"
rsync -avz --progress \
  -e "ssh -p $SERVER_PORT" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env.local' \
  --exclude '.env.development.local' \
  --exclude '.env.test.local' \
  --exclude '.env.production.local' \
  --exclude 'dump.sql' \
  --exclude '*.sql' \
  --exclude '*.backup' \
  --exclude '*.dump' \
  "$LOCAL_DIR/" "$SERVER_USER@$SERVER_HOST:$SERVER_DIR/"

echo -e "${GREEN}✅ Dosyalar aktarıldı${NC}"
echo ""

# 2. Sunucuda .env.production dosyası oluştur (eğer yoksa)
echo -e "${YELLOW}⚙️  .env.production kontrol ediliyor...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'ENDSSH'
cd /var/www/alpdinamik

if [ ! -f ".env.production" ]; then
    echo "⚠️  .env.production dosyası bulunamadı!"
    echo "📝 Lütfen sunucuda manuel olarak oluşturun:"
    echo ""
    echo "cd /var/www/alpdinamik"
    echo "nano .env.production"
    echo ""
    echo "Gerekli değişkenler:"
    echo "  - SITE_NAME=alpdinamik"
    echo "  - SITE_PORT=3001"
    echo "  - DB_USER=alpdinamik_user"
    echo "  - DB_PASSWORD=<güvenli-şifre>"
    echo "  - DB_NAME=alpdinamik_db"
    echo "  - DB_PORT=5432"
    echo "  - DATABASE_URL=postgresql://alpdinamik_user:<şifre>@alpdinamik-postgres:5432/alpdinamik_db?schema=public&connection_limit=20&pool_timeout=20"
    echo "  - NEXTAUTH_SECRET=<güvenli-secret>"
    echo "  - NEXTAUTH_URL=http://178.157.14.211:3001"
    echo "  - NEXT_PUBLIC_API_URL=http://178.157.14.211:3001"
    echo "  - NODE_ENV=production"
    exit 1
else
    echo "✅ .env.production mevcut"
fi
ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment hazır!${NC}"
echo ""
echo -e "${YELLOW}📝 Sunucuda çalıştırmanız gereken komutlar:${NC}"
echo ""
echo "  cd /var/www/alpdinamik"
echo "  docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build"
echo ""
echo -e "${BLUE}🌐 Site erişim adresi: http://178.157.14.211:3001${NC}"

