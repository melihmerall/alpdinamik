#!/bin/bash
# Yerel database'i tekrar export et (UTF-8 encoding ile)

set -e

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Yerel Docker container bilgileri
LOCAL_CONTAINER="alpdinamik-postgres"
LOCAL_DB_USER="postgres"
LOCAL_DB_NAME="alpdinamik_db"

# Output dosyası
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_FILE="alpdinamik-dump-${TIMESTAMP}.sql"

echo -e "${YELLOW}📤 Database Export (UTF-8 Encoding)${NC}"
echo ""

# Container'ın çalıştığını kontrol et
if ! docker ps | grep -q "$LOCAL_CONTAINER"; then
    echo -e "${RED}❌ Container çalışmıyor: $LOCAL_CONTAINER${NC}"
    echo -e "${YELLOW}💡 Önce container'ı başlatın:${NC}"
    echo "   docker compose up -d"
    exit 1
fi

echo -e "${YELLOW}📂 Export ediliyor: $OUTPUT_FILE${NC}"
echo ""

# UTF-8 encoding ile export et
docker exec $LOCAL_CONTAINER pg_dump \
    -U $LOCAL_DB_USER \
    -d $LOCAL_DB_NAME \
    --encoding=UTF8 \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    > "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    # Dosya boyutunu kontrol et
    FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo -e "${GREEN}✅ Export tamamlandı!${NC}"
    echo -e "${GREEN}📁 Dosya: $OUTPUT_FILE${NC}"
    echo -e "${GREEN}📊 Boyut: $FILE_SIZE${NC}"
    echo ""
    echo -e "${YELLOW}💡 Bu dosyayı sunucuya aktarın:${NC}"
    echo "   scp -P 23422 $OUTPUT_FILE root@178.157.14.211:/var/www/alpdinamik/"
else
    echo -e "${RED}❌ Export başarısız!${NC}"
    exit 1
fi

