#!/bin/bash

# Alpdinamik Sunucu Kurulum Script'i
# Bu script sunucuda root olarak çalıştırılacak

set -e

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Alpdinamik Sunucu Kurulumu Başlıyor...${NC}"
echo ""

# 1. Sistem güncellemesi
echo -e "${YELLOW}📦 Sistem güncelleniyor...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✅ Sistem güncellendi${NC}"
echo ""

# 2. Docker kurulumu
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Docker kuruluyor...${NC}"
    apt install -y docker.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}✅ Docker kuruldu${NC}"
    docker --version
else
    echo -e "${GREEN}✅ Docker zaten kurulu: $(docker --version)${NC}"
fi
echo ""

# 3. Docker Compose kontrolü
if ! command -v docker compose &> /dev/null; then
    echo -e "${YELLOW}📦 Docker Compose plugin kuruluyor...${NC}"
    apt install -y docker-compose-plugin
    echo -e "${GREEN}✅ Docker Compose kuruldu${NC}"
else
    echo -e "${GREEN}✅ Docker Compose zaten kurulu${NC}"
fi
echo ""

# 4. Git kurulumu
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📥 Git kuruluyor...${NC}"
    apt install -y git
    echo -e "${GREEN}✅ Git kuruldu${NC}"
else
    echo -e "${GREEN}✅ Git zaten kurulu: $(git --version)${NC}"
fi
echo ""

# 5. Gerekli paketler
echo -e "${YELLOW}📦 Ek paketler kuruluyor...${NC}"
apt install -y curl wget nano ufw
echo -e "${GREEN}✅ Paketler kuruldu${NC}"
echo ""

# 6. Firewall ayarları
echo -e "${YELLOW}🔥 Firewall ayarlanıyor...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3001/tcp  # Alpdinamik için
    ufw --force enable
    echo -e "${GREEN}✅ Firewall ayarlandı${NC}"
    ufw status
else
    echo -e "${YELLOW}⚠️  UFW bulunamadı, firewall manuel ayarlanmalı${NC}"
fi
echo ""

# 7. Proje klasörü oluştur
PROJECT_DIR="/var/www/alpdinamik"
echo -e "${YELLOW}📁 Proje klasörü oluşturuluyor: $PROJECT_DIR${NC}"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR
echo -e "${GREEN}✅ Klasör oluşturuldu${NC}"
echo ""

# 8. Docker test
echo -e "${YELLOW}🧪 Docker test ediliyor...${NC}"
docker run --rm hello-world
echo -e "${GREEN}✅ Docker çalışıyor!${NC}"
echo ""

# 9. Sistem bilgileri
echo -e "${BLUE}📊 Sistem Bilgileri:${NC}"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d '"' -f 2)"
echo "Kernel: $(uname -r)"
echo "RAM: $(free -h | grep Mem | awk '{print $2}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $4}') boş"
echo ""

echo -e "${GREEN}✅ Sunucu hazırlığı tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}📝 Sonraki adımlar:${NC}"
echo "   1. Projeyi $PROJECT_DIR klasörüne aktarın"
echo "   2. .env.production dosyasını oluşturun"
echo "   3. Database dump'ını import edin"
echo "   4. docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build"
echo ""
