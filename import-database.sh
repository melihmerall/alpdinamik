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

# Dump'ı import et
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < $DUMP_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database başarıyla import edildi!${NC}"
else
    echo -e "${RED}❌ Database import hatası!${NC}"
    exit 1
fi

