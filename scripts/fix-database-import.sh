#!/bin/bash
# Database import sorunlarını düzeltmek için script

set -e

SITE_NAME="alpdinamik"
CONTAINER_NAME="${SITE_NAME}-postgres"

echo "🔧 Database Import Düzeltme Scripti"
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

echo "📂 Dump dosyası: $DUMP_FILE"
echo ""

# Dump dosyasının formatını kontrol et
echo "🔍 Dump dosyası formatı kontrol ediliyor..."
if file "$DUMP_FILE" | grep -q "text"; then
    echo "✅ Dump dosyası text formatında"
    ENCODING=$(file -bi "$DUMP_FILE" | sed -e 's/.*charset=//')
    echo "📝 Encoding: $ENCODING"
    
    # UTF8'e çevir (eğer değilse)
    if [[ "$ENCODING" != *"utf-8"* ]] && [[ "$ENCODING" != *"UTF-8"* ]]; then
        echo "🔄 UTF-8'e çevriliyor..."
        iconv -f "$ENCODING" -t UTF-8 "$DUMP_FILE" > "${DUMP_FILE}.utf8"
        DUMP_FILE="${DUMP_FILE}.utf8"
        echo "✅ UTF-8 formatına çevrildi"
    fi
else
    echo "⚠️  Dump dosyası binary formatında olabilir"
fi

echo ""
echo "🗄️  Database'e import ediliyor..."

# Önce mevcut verileri temizle (dikkatli!)
read -p "⚠️  Mevcut database verileri silinecek. Devam etmek istiyor musunuz? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Mevcut veriler temizleniyor..."
    docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME << EOF
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL ON SCHEMA public TO public;
EOF
    echo "✅ Veriler temizlendi"
fi

# Import et
echo "📥 Import başlıyor..."
docker exec -i $CONTAINER_NAME bash -c "export PGCLIENTENCODING=UTF8 && psql -U $DB_USER -d $DB_NAME" < "$DUMP_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database başarıyla import edildi!"
    
    # Geçici UTF8 dosyasını sil
    if [ -f "${DUMP_FILE}.utf8" ]; then
        rm "${DUMP_FILE}.utf8"
    fi
else
    echo ""
    echo "❌ Import başarısız!"
    echo "💡 Alternatif yöntem deneniyor..."
    
    # Alternatif: Dosyayı container'a kopyala
    docker cp "$DUMP_FILE" $CONTAINER_NAME:/tmp/dump.sql
    docker exec -i $CONTAINER_NAME bash -c "export PGCLIENTENCODING=UTF8 && psql -U $DB_USER -d $DB_NAME -f /tmp/dump.sql"
    
    if [ $? -eq 0 ]; then
        echo "✅ Database başarıyla import edildi! (alternatif yöntem)"
        docker exec -i $CONTAINER_NAME rm /tmp/dump.sql
    else
        echo "❌ Tüm yöntemler başarısız!"
        echo "💡 Dump dosyasını kontrol edin veya manuel import yapın"
        exit 1
    fi
fi

echo ""
echo "✅ İşlem tamamlandı!"

