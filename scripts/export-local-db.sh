#!/bin/bash

# Local Database Export Script
# Local Docker container'dan database dump alır

set -e

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Local container adı (docker-compose.dev.yml'den)
LOCAL_CONTAINER="alpdinamik-db-dev"
LOCAL_DB_USER="alpdinamik"
LOCAL_DB_NAME="alpdinamik_db"
OUTPUT_FILE="alpdinamik-dump-$(date +%Y%m%d-%H%M%S).sql"

echo -e "${YELLOW}📤 Local Database Export${NC}"
echo ""

# Container'ın çalıştığından emin ol
if ! docker ps | grep -q "$LOCAL_CONTAINER"; then
    echo -e "${RED}❌ Local database container çalışmıyor: $LOCAL_CONTAINER${NC}"
    echo -e "${YELLOW}💡 Önce local container'ı başlatın:${NC}"
    echo "   docker-compose -f docker-compose.dev.yml up -d"
    exit 1
fi

echo -e "${YELLOW}📥 Database dump alınıyor...${NC}"
docker exec $LOCAL_CONTAINER pg_dump -U $LOCAL_DB_USER -d $LOCAL_DB_NAME > $OUTPUT_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database dump oluşturuldu: $OUTPUT_FILE${NC}"
    echo -e "${YELLOW}📝 Dosya boyutu: $(du -h $OUTPUT_FILE | cut -f1)${NC}"
    echo ""
    echo -e "${YELLOW}📤 Bu dosyayı sunucuya aktarın:${NC}"
    echo "   scp -P 23422 $OUTPUT_FILE root@178.157.14.211:/var/www/alpdinamik/"
    echo ""
    echo -e "${YELLOW}📥 Sunucuda import için:${NC}"
    echo "   ssh -p 23422 root@178.157.14.211"
    echo "   cd /var/www/alpdinamik"
    echo "   chmod +x import-database.sh"
    echo "   ./import-database.sh $OUTPUT_FILE"
else
    echo -e "${RED}❌ Database dump hatası!${NC}"
    exit 1
fi

