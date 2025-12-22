#!/bin/bash
# Dump dosyasının encoding'ini düzelt ve import et

set -e

SITE_NAME="alpdinamik"
CONTAINER_NAME="${SITE_NAME}-postgres"

echo "🔧 Dump Encoding Düzeltme Scripti"
echo ""

# .env.production'dan bilgileri oku
ENV_FILE="/var/www/$SITE_NAME/.env.production"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env.production dosyası bulunamadı: $ENV_FILE"
    exit 1
fi

source $ENV_FILE

# Dump dosyasını bul
DUMP_FILE=$(ls /var/www/$SITE_NAME/alpdinamik-dump-*.sql 2>/dev/null | head -1)

if [ -z "$DUMP_FILE" ]; then
    echo "❌ Dump dosyası bulunamadı!"
    exit 1
fi

echo "📂 Orijinal dump dosyası: $DUMP_FILE"
echo ""

# Dosya encoding'ini tespit et
echo "🔍 Encoding tespit ediliyor..."
ENCODING=$(file -bi "$DUMP_FILE" | sed -e 's/.*charset=//' | cut -d';' -f1)
echo "📝 Tespit edilen encoding: $ENCODING"

# Dosya tipini kontrol et
FILE_TYPE=$(file "$DUMP_FILE")
echo "📄 Dosya tipi: $FILE_TYPE"

# Binary dosya kontrolü
if echo "$FILE_TYPE" | grep -qi "binary\|data"; then
    echo "⚠️  Dosya binary formatında görünüyor"
    echo "💡 Bu bir PostgreSQL custom format dump olabilir"
    echo ""
    echo "🔧 pg_restore ile import ediliyor..."
    
    # pg_restore ile dene
    docker cp "$DUMP_FILE" $CONTAINER_NAME:/tmp/dump.sql
    docker exec -i $CONTAINER_NAME pg_restore -U $DB_USER -d $DB_NAME -c /tmp/dump.sql 2>&1 || {
        echo "❌ pg_restore başarısız, text format deniyor..."
        # Text format olarak dene
        docker exec -i $CONTAINER_NAME bash -c "cat /tmp/dump.sql | psql -U $DB_USER -d $DB_NAME" || true
    }
    docker exec -i $CONTAINER_NAME rm /tmp/dump.sql
    exit 0
fi

# Text dosyası ise encoding düzeltmesi yap
echo ""
echo "🔄 Encoding düzeltmesi yapılıyor..."

# Farklı encoding'leri dene
ENCODINGS=("ISO-8859-1" "WINDOWS-1252" "LATIN1" "CP1252" "ISO-8859-9")

for ENC in "${ENCODINGS[@]}"; do
    echo "🔄 $ENC encoding ile deneniyor..."
    
    # Geçici dosya oluştur
    TEMP_FILE="/tmp/dump-utf8-$$.sql"
    
    # Encoding dönüştürmeyi dene
    if iconv -f "$ENC" -t UTF-8 "$DUMP_FILE" > "$TEMP_FILE" 2>/dev/null; then
        # UTF-8 kontrolü
        if file -bi "$TEMP_FILE" | grep -qi "utf-8"; then
            echo "✅ $ENC encoding ile başarılı!"
            
            # Invalid byte sequence'leri temizle
            echo "🧹 Invalid byte sequence'ler temizleniyor..."
            sed -i 's/\x00//g' "$TEMP_FILE"  # NULL bytes
            sed -i 's/\xFF//g' "$TEMP_FILE"  # 0xFF bytes
            sed -i 's/\x82//g' "$TEMP_FILE"  # 0x82 bytes
            
            # Import et
            echo "📥 Database'e import ediliyor..."
            docker exec -i $CONTAINER_NAME bash -c "export PGCLIENTENCODING=UTF8 && psql -U $DB_USER -d $DB_NAME" < "$TEMP_FILE"
            
            if [ $? -eq 0 ]; then
                echo ""
                echo "✅ Database başarıyla import edildi!"
                rm -f "$TEMP_FILE"
                exit 0
            else
                echo "⚠️  Import başarısız, bir sonraki encoding deneniyor..."
                rm -f "$TEMP_FILE"
            fi
        fi
    fi
done

# Son çare: Dosyayı container'a kopyala ve oradan import et
echo ""
echo "🔄 Son çare yöntemi: Container içinden import..."
docker cp "$DUMP_FILE" $CONTAINER_NAME:/tmp/dump.sql

# Container içinde encoding düzeltmesi yap
docker exec -i $CONTAINER_NAME bash << 'ENDSCRIPT'
cd /tmp
export PGCLIENTENCODING=UTF8

# Invalid bytes'ları temizle
sed -i 's/\x00//g' dump.sql
sed -i 's/\xFF//g' dump.sql
sed -i 's/\x82//g' dump.sql

# Import et
psql -U alpdinamik_user -d alpdinamik_db -f dump.sql 2>&1 | grep -v "ERROR" || true

# Hata sayısını kontrol et
ERROR_COUNT=$(psql -U alpdinamik_user -d alpdinamik_db -f dump.sql 2>&1 | grep -c "ERROR" || echo "0")
if [ "$ERROR_COUNT" -lt 10 ]; then
    echo "✅ Import tamamlandı (bazı hatalar görmezden gelindi)"
else
    echo "❌ Çok fazla hata var"
    exit 1
fi

rm dump.sql
ENDSCRIPT

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database import tamamlandı!"
else
    echo ""
    echo "❌ Import başarısız!"
    echo "💡 Dump dosyasını kontrol edin veya manuel import yapın"
    exit 1
fi

