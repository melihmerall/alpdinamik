#!/bin/bash

# Database Import Script
# Local Docker database'den dump alıp production'a import eder

set -e

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SITE_NAME="alpdinamik"
CONTAINER_NAME="${SITE_NAME}-postgres"

echo -e "${YELLOW}📥 Database Import Script${NC}"
echo ""

# Kullanıcıdan dump dosyası yolunu al
if [ -z "$1" ]; then
    echo -e "${RED}❌ Kullanım: $0 <dump_file.sql>${NC}"
    echo "   Örnek: $0 /path/to/dump.sql"
    exit 1
fi

DUMP_FILE=$1

if [ ! -f "$DUMP_FILE" ]; then
    echo -e "${RED}❌ Dump dosyası bulunamadı: $DUMP_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}📂 Dump dosyası: $DUMP_FILE${NC}"

# .env.production'dan bilgileri oku
ENV_FILE="/var/www/$SITE_NAME/.env.production"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ .env.production dosyası bulunamadı: $ENV_FILE${NC}"
    exit 1
fi

source $ENV_FILE

echo -e "${YELLOW}🗄️  Database'e import ediliyor...${NC}"

# Database container'ının çalıştığından emin ol
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}❌ Database container çalışmıyor: $CONTAINER_NAME${NC}"
    echo -e "${YELLOW}💡 Önce container'ları başlatın:${NC}"
    echo "   cd /var/www/$SITE_NAME"
    echo "   docker compose -f docker-compose.prod.yml --env-file .env.production up -d"
    exit 1
fi

# Dump'ı import et (UTF8 encoding ile)
# Önce database'i temizle (opsiyonel - dikkatli kullanın)
# docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Encoding sorunlarını önlemek için LC_ALL ve encoding ayarları
docker exec -i $CONTAINER_NAME bash -c "export PGCLIENTENCODING=UTF8 && psql -U $DB_USER -d $DB_NAME" < "$DUMP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database başarıyla import edildi!${NC}"
else
    echo -e "${YELLOW}⚠️  İlk deneme başarısız, alternatif yöntem deneniyor...${NC}"
    # Alternatif: Dosyayı container'a kopyala ve oradan import et
    docker cp "$DUMP_FILE" $CONTAINER_NAME:/tmp/dump.sql
    docker exec -i $CONTAINER_NAME bash -c "export PGCLIENTENCODING=UTF8 && psql -U $DB_USER -d $DB_NAME -f /tmp/dump.sql"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database başarıyla import edildi! (alternatif yöntem)${NC}"
        docker exec -i $CONTAINER_NAME rm /tmp/dump.sql
    else
        echo -e "${RED}❌ Database import hatası!${NC}"
        echo -e "${YELLOW}💡 Dump dosyasını kontrol edin. Binary format ise pg_restore kullanın.${NC}"
        exit 1
    fi
fi

