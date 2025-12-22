#!/bin/bash

# .env.production Dosyasını Kontrol Et

echo "🔍 .env.production Dosyasını Kontrol Ediyoruz..."
echo ""

if [ ! -f ".env.production" ]; then
    echo "❌ .env.production dosyası bulunamadı!"
    exit 1
fi

echo "✅ .env.production dosyası mevcut"
echo ""

# Dosya içeriğini göster (şifreler gizli)
echo "=== Dosya İçeriği (şifreler gizli) ==="
while IFS= read -r line; do
    if [[ $line == *"PASSWORD"* ]] || [[ $line == *"SECRET"* ]]; then
        KEY=$(echo "$line" | cut -d'=' -f1)
        echo "$KEY=***"
    else
        echo "$line"
    fi
done < .env.production
echo ""

# Önemli değişkenlerin varlığını kontrol et
echo "=== Önemli Değişkenler Kontrolü ==="
REQUIRED_VARS=("DATABASE_URL" "DB_PASSWORD" "NEXTAUTH_SECRET" "NEXTAUTH_URL")

for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${var}=" .env.production; then
        VALUE=$(grep "^${var}=" .env.production | cut -d'=' -f2-)
        if [ -z "$VALUE" ]; then
            echo "⚠️  $var: tanımlı ama değeri boş"
        else
            echo "✅ $var: tanımlı (değer gizli)"
        fi
    else
        echo "❌ $var: bulunamadı"
    fi
done
echo ""

echo "✅ Kontrol tamamlandı!"

