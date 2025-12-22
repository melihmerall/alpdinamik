#!/bin/bash

# Environment Variables Düzeltme Scripti

set -e

echo "🔧 Environment Variables Düzeltiyoruz..."
echo ""

# 1. .env.production kontrolü
echo "=== 1. .env.production Dosyası Kontrolü ==="
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production dosyası bulunamadı!"
    exit 1
fi

echo "✅ .env.production dosyası mevcut"
echo ""

# 2. .env.production içeriğini kontrol et (şifreler hariç)
echo "=== 2. .env.production İçeriği (şifreler gizli) ==="
grep -v "PASSWORD\|SECRET" .env.production | head -10 || echo "Dosya boş veya okunamıyor"
echo ""

# 3. DATABASE_URL kontrolü
echo "=== 3. DATABASE_URL Kontrolü ==="
if grep -q "DATABASE_URL" .env.production; then
    echo "✅ DATABASE_URL .env.production'da mevcut"
    DATABASE_URL_VALUE=$(grep "^DATABASE_URL=" .env.production | cut -d'=' -f2-)
    if [ -z "$DATABASE_URL_VALUE" ]; then
        echo "⚠️  DATABASE_URL değeri boş!"
    else
        echo "✅ DATABASE_URL değeri mevcut (gizli)"
    fi
else
    echo "❌ DATABASE_URL .env.production'da bulunamadı!"
fi
echo ""

# 4. App container environment variables
echo "=== 4. App Container Environment Variables ==="
echo "Mevcut DATABASE_URL:"
docker exec alpdinamik-app env | grep DATABASE_URL || echo "❌ DATABASE_URL bulunamadı"
echo ""

# 5. Container'ı yeniden başlat (env dosyasını yüklemek için)
echo "=== 5. Container'ı Yeniden Başlatıyoruz (env dosyasını yüklemek için) ==="
read -p "Container'ı yeniden başlatmak istiyor musunuz? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⏳ Container'lar durduruluyor..."
    docker-compose -f docker-compose.prod.yml down
    
    echo "⏳ Container'lar başlatılıyor..."
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "⏳ Container'ların hazır olması bekleniyor (30 saniye)..."
    sleep 30
    
    echo "✅ Container'lar başlatıldı"
else
    echo "⚠️  Container yeniden başlatılmadı. Manuel olarak başlatmanız gerekecek:"
    echo "   docker-compose -f docker-compose.prod.yml restart app"
fi
echo ""

# 6. Tekrar kontrol
echo "=== 6. Yeniden Kontrol ==="
echo "App container DATABASE_URL:"
docker exec alpdinamik-app env | grep DATABASE_URL || echo "❌ DATABASE_URL hala bulunamadı"
echo ""

echo "✅ İşlem tamamlandı!"

