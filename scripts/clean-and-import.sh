#!/bin/bash
# Dump dosyasını temizle ve import et

set -e

SITE_NAME="alpdinamik"
CONTAINER_NAME="${SITE_NAME}-postgres"

echo "🧹 Dump Dosyası Temizleme ve Import"
echo ""

# .env.production'dan bilgileri oku
ENV_FILE="/var/www/$SITE_NAME/.env.production"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env.production dosyası bulunamadı"
    exit 1
fi

source $ENV_FILE

# Dump dosyasını bul
DUMP_FILE=$(ls /var/www/$SITE_NAME/alpdinamik-dump-utf8*.sql 2>/dev/null | head -1)

if [ -z "$DUMP_FILE" ]; then
    echo "❌ Dump dosyası bulunamadı!"
    exit 1
fi

echo "📂 Dump dosyası: $DUMP_FILE"
echo ""

# Temizlenmiş dosya
CLEANED_FILE="/tmp/dump-cleaned-$$.sql"

echo "🧹 Invalid byte sequence'ler temizleniyor..."

# Tüm problematik byte'ları temizle
sed 's/\x00//g; s/\xFF//g; s/\x82//g; s/\x83//g; s/\x84//g; s/\x85//g; s/\x86//g; s/\x87//g; s/\x88//g; s/\x89//g; s/\x8A//g; s/\x8B//g; s/\x8C//g; s/\x8D//g; s/\x8E//g; s/\x8F//g' "$DUMP_FILE" > "$CLEANED_FILE"

# UTF-8 kontrolü ve dönüştürme
if ! file -bi "$CLEANED_FILE" | grep -qi "utf-8"; then
    echo "🔄 UTF-8'e çevriliyor..."
    iconv -f WINDOWS-1252 -t UTF-8//IGNORE "$CLEANED_FILE" > "${CLEANED_FILE}.utf8" 2>/dev/null || \
    iconv -f ISO-8859-9 -t UTF-8//IGNORE "$CLEANED_FILE" > "${CLEANED_FILE}.utf8" 2>/dev/null || \
    cp "$CLEANED_FILE" "${CLEANED_FILE}.utf8"
    CLEANED_FILE="${CLEANED_FILE}.utf8"
fi

echo "✅ Dosya temizlendi: $CLEANED_FILE"
echo ""

# Database'i temizle
read -p "⚠️  Mevcut database verileri silinecek. Devam? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Mevcut veriler temizleniyor..."
    docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME << 'EOF'
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO alpdinamik_user;
GRANT ALL ON SCHEMA public TO public;
EOF
    echo "✅ Veriler temizlendi"
fi

echo ""
echo "📥 Import başlıyor..."

# Import et - hataları filtrele
docker exec -i $CONTAINER_NAME bash -c "export PGCLIENTENCODING=UTF8 && psql -U $DB_USER -d $DB_NAME" < "$CLEANED_FILE" 2>&1 | \
    grep -v "ERROR.*invalid byte sequence" | \
    grep -v "ERROR.*encoding" | \
    grep -v "ERROR.*role" | \
    grep -v "NOTICE" || true

echo ""
echo "🔍 Import sonucu kontrol ediliyor..."

# Kontrol et
REP_COUNT=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM representatives;" 2>/dev/null | tr -d ' ' || echo "0")
PROD_COUNT=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM products;" 2>/dev/null | tr -d ' ' || echo "0")
BANNER_COUNT=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM banners;" 2>/dev/null | tr -d ' ' || echo "0")

echo ""
echo "📊 Import Sonuçları:"
echo "   Representatives: $REP_COUNT"
echo "   Products: $PROD_COUNT"
echo "   Banners: $BANNER_COUNT"

if [ "$REP_COUNT" != "0" ] || [ "$PROD_COUNT" != "0" ] || [ "$BANNER_COUNT" != "0" ]; then
    echo ""
    echo "✅ Import başarılı! Veriler yüklendi."
else
    echo ""
    echo "⚠️  Import tamamlandı ama veri bulunamadı."
    echo "💡 Yerel database'de veri olduğundan emin olun."
fi

# Temizlik
rm -f "$CLEANED_FILE" "${CLEANED_FILE}.utf8"

echo ""
echo "✅ İşlem tamamlandı!"

