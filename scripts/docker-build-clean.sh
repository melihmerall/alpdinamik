#!/bin/bash

# Docker Clean & Rebuild Script
# Bu script sadece app container'ını temizler ve yeniden build eder
# Veritabanı container'ına ve verilerine DOKUNMAZ

set -e

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Docker Clean & Rebuild Başlıyor${NC}"
echo -e "${GREEN}Veritabanı container'ına dokunulmayacak${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. Mevcut durumu kontrol et
echo -e "\n${YELLOW}[1/7] Mevcut container durumu kontrol ediliyor...${NC}"
docker-compose -f docker-compose.prod.yml ps

# Veritabanı container'ının çalıştığını kontrol et
if ! docker ps | grep -q alpdinamik-postgres; then
    echo -e "${RED}UYARI: Veritabanı container'ı çalışmıyor!${NC}"
    read -p "Devam etmek istiyor musunuz? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ Veritabanı container'ı çalışıyor${NC}"
fi

# 2. App container'ını durdur
echo -e "\n${YELLOW}[2/7] App container durduruluyor...${NC}"
docker-compose -f docker-compose.prod.yml stop app || echo "App container zaten durmuş"

# 3. App container'ını sil (veriler korunur, volume'lara dokunulmaz)
echo -e "\n${YELLOW}[3/7] App container siliniyor...${NC}"
docker-compose -f docker-compose.prod.yml rm -f app || echo "App container zaten silinmiş"

# 4. Dangling image'ları temizle (sadece kullanılmayan image'lar)
echo -e "\n${YELLOW}[4/7] Dangling image'lar temizleniyor...${NC}"
docker image prune -f

# 5. Eski app image'ını sil (opsiyonel - sadece alpdinamik-app image'ı)
echo -e "\n${YELLOW}[5/7] Eski app image kontrol ediliyor...${NC}"
OLD_IMAGE=$(docker images | grep "alpdinamik.*app" | grep -v "REPOSITORY" | awk '{print $3}' | head -1)
if [ ! -z "$OLD_IMAGE" ]; then
    echo -e "${YELLOW}Eski app image bulundu: $OLD_IMAGE${NC}"
    read -p "Eski app image'ı silmek istiyor musunuz? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker rmi $OLD_IMAGE || echo "Image silinemedi (muhtemelen kullanılıyor)"
    fi
else
    echo -e "${GREEN}Eski app image bulunamadı${NC}"
fi

# 6. Yeni build yap
echo -e "\n${YELLOW}[6/7] Yeni build yapılıyor...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache app

# 7. Container'ı başlat
echo -e "\n${YELLOW}[7/7] Container başlatılıyor...${NC}"
docker-compose -f docker-compose.prod.yml up -d app

# Durum kontrolü
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}İşlem Tamamlandı!${NC}"
echo -e "${GREEN}========================================${NC}"

# Container durumunu göster
echo -e "\n${YELLOW}Container Durumu:${NC}"
docker-compose -f docker-compose.prod.yml ps

# Logları göster
echo -e "\n${YELLOW}Son loglar (Ctrl+C ile çıkış):${NC}"
docker-compose -f