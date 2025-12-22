#!/bin/bash
# Agresif dump temizleme ve import

set -e

SITE_NAME="alpdinamik"
CONTAINER_NAME="${SITE_NAME}-postgres"

echo "🧹 Agresif Dump Temizleme"
echo ""

# .env.production'dan bilgileri oku
ENV_FILE="/var/www/$SITE_NAME/.env.production"
source $ENV_FILE

# Dump dosyasını bul
DUMP_FILE=$(ls /var/www/$SITE_NAME/alpdinamik-dump*.sql 2>/dev/null | head -1)

if [ -z "$DUMP_FILE" ]; then
    echo "❌ Dump dosyası bulunamadı!"
    exit 1
fi

echo "📂 Orijinal dosya: $DUMP_FILE"
CLEANED_FILE="/tmp/dump-ultra-clean-$$.sql"

echo "🧹 Agresif temizleme başlıyor..."

# Tüm binary karakterleri temizle (0x00-0x1F ve 0x7F-0xFF arası)
# Sadece yazdırılabilir ASCII ve UTF-8 karakterleri bırak
tr -cd '\11\12\15\40-\176\200-\377' < "$DUMP_FILE" > "$CLEANED_FILE" 2>/dev/null || {
    # Alternatif: sed ile temizle
    sed 's/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\xFF]//g' "$DUMP_FILE" > "$CLEANED_FILE"
}

# Ek temizleme: Problemli byte sequence'leri kaldır
sed -i 's/\xFF//g' "$CLEANED_FILE" 2>/dev/null || sed 's/\xFF//g' "$CLEANED_FILE" > "${CLEANED_FILE}.tmp" && mv "${CLEANED_FILE}.tmp" "$CLEANED_FILE"

echo "✅ Temizlenmiş dosya: $CLEANED_FILE"
echo "📊 Dosya boyutu: $(du -h "$CLEANED_FILE" | cut -f1)"
echo ""

# Database'i temizle
read -p "⚠️  Database temizlenecek. Devam? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Database temizleniyor..."
    docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME << 'EOF'
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO alpdinamik_user;
GRANT ALL ON SCHEMA public TO public;
EOF
fi

echo ""
echo "📥 Import başlıyor..."

# Import et - tüm hataları filtrele
docker exec -i $CONTAINER_NAME bash -c "export PGCLIENTENCODING=UTF8 && psql -U $DB_USER -d $DB_NAME" < "$CLEANED_FILE" 2>&1 | \
    grep -v "ERROR.*invalid byte" | \
    grep -v "ERROR.*encoding" | \
    grep -v "ERROR.*role" | \
    grep -v "NOTICE" | \
    tail -20

echo ""
echo "🔍 Kontrol ediliyor..."

# Kontrol
REP_COUNT=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM representatives;" 2>/dev/null | tr -d ' ' || echo "0")
PROD_COUNT=$(docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM products;" 2>/dev/null | tr -d ' ' || echo "0")

echo "📊 Sonuçlar:"
echo "   Representatives: $REP_COUNT"
echo "   Products: $PROD_COUNT"

# Temizlik
rm -f "$CLEANED_FILE"

echo ""
echo "✅ İşlem tamamlandı!"

