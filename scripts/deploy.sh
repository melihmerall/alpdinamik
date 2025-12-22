#!/bin/bash

# Alpdinamik Production Deployment Script
# Bu script sunucuda çalıştırılacak

set -e  # Hata durumunda dur

echo "🚀 Alpdinamik Production Deployment Başlıyor..."

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Sistem güncellemesi
echo -e "${YELLOW}📦 Sistem güncelleniyor...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Docker kurulumu
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Docker kuruluyor...${NC}"
    sudo apt install -y docker.io docker-compose-plugin
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker kuruldu${NC}"
else
    echo -e "${GREEN}✅ Docker zaten kurulu${NC}"
fi

# 3. Git kurulumu
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📥 Git kuruluyor...${NC}"
    sudo apt install -y git
    echo -e "${GREEN}✅ Git kuruldu${NC}"
else
    echo -e "${GREEN}✅ Git zaten kurulu${NC}"
fi

# 4. Firewall ayarları
echo -e "${YELLOW}🔥 Firewall ayarlanıyor...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    echo -e "${GREEN}✅ Firewall ayarlandı${NC}"
fi

# 5. Proje klasörü oluştur
PROJECT_DIR="/var/www/alpdinamik"
echo -e "${YELLOW}📁 Proje klasörü oluşturuluyor: $PROJECT_DIR${NC}"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR

# 6. Environment variables kontrolü
if [ ! -f "$PROJECT_DIR/.env.production" ]; then
    echo -e "${YELLOW}⚙️  .env.production dosyası oluşturuluyor...${NC}"
    cat > $PROJECT_DIR/.env.production << EOF
# Database Configuration
DB_USER=alpdinamik
DB_PASSWORD=CHANGE_THIS_PASSWORD
DB_NAME=alpdinamik_db
DB_PORT=5432

# Database URL (Docker internal)
DATABASE_URL=postgresql://alpdinamik:CHANGE_THIS_PASSWORD@postgres:5432/alpdinamik_db?schema=public&connection_limit=20&pool_timeout=20

# NextAuth Configuration
NEXTAUTH_SECRET=CHANGE_THIS_SECRET
NEXTAUTH_URL=https://yourdomain.com

# Next.js Configuration
NEXT_PUBLIC_API_URL=https://yourdomain.com
NODE_ENV=production

# Application Port
APP_PORT=3000
EOF
    echo -e "${RED}⚠️  ÖNEMLİ: .env.production dosyasını düzenleyin!${NC}"
    echo -e "${YELLOW}   nano $PROJECT_DIR/.env.production${NC}"
else
    echo -e "${GREEN}✅ .env.production dosyası mevcut${NC}"
fi

echo -e "${GREEN}✅ Deployment script tamamlandı!${NC}"
echo -e "${YELLOW}📝 Sonraki adımlar:${NC}"
echo "   1. Projeyi $PROJECT_DIR klasörüne aktarın"
echo "   2. .env.production dosyasını düzenleyin"
echo "   3. docker compose -f docker-compose.prod.yml up -d --build komutunu çalıştırın"

