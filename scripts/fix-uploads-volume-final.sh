#!/bin/bash

# Upload Volume Mount Final Düzeltme

set -e

echo "🔧 Upload Volume Mount Final Düzeltme..."
echo ""

# 1. Container'ı durdur
echo "=== 1. Container'ı Durduruyoruz ==="
cd /var/www/alpdinamik
docker-compose -f docker-compose.prod.yml --env-file .env.production down
echo ""

# 2. Standalone public klasörü var mı kontrol et (build sonrası)
echo "=== 2. Standalone Public Klasörü Kontrolü ==="
echo "⚠️  Not: Bu kontrol build sonrası yapılacak"
echo ""

# 3. Container'ı yeniden başlat
echo "=== 3. Container'ı Yeniden Başlatıyoruz ==="
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
echo ""

# 4. Container'ın hazır olmasını bekle
echo "=== 4. Container'ın Hazır Olmasını Bekliyoruz ==="
echo "⏳ 30 saniye bekleniyor..."
sleep 30
echo ""

# 5. Standalone public klasörü kontrolü
echo "=== 5. Standalone Public Klasörü Kontrolü ==="
if docker exec alpdinamik-app test -d "/app/.next/standalone/public"; then
    echo "✅ Standalone public klasörü mevcut"
    docker exec alpdinamik-app ls -la /app/.next/standalone/public | head -5
else
    echo "⚠️  Standalone public klasörü yok (build gerekebilir)"
fi
echo ""

# 6. Uploads klasörü kontrolü
echo "=== 6. Uploads Klasörü Kontrolü ==="
echo "Standalone uploads:"
docker exec alpdinamik-app ls -la /app/.next/standalone/public/uploads 2>/dev/null | head -5 || echo "⚠️  Standalone uploads yok"
echo ""
echo "Public uploads:"
docker exec alpdinamik-app ls -la /app/public/uploads 2>/dev/null | head -5 || echo "⚠️  Public uploads yok"
echo ""

# 7. Test
echo "=== 7. Erişim Testi ==="
echo "Test: /uploads/settings/1766040664723-favicon.jpg"
curl -I http://localhost:3001/uploads/settings/1766040664723-favicon.jpg 2>&1 | head -5
echo ""

echo "✅ İşlem tamamlandı!"
echo ""
echo "📝 Not: Eğer hala 404 hatası alıyorsanız, container'ı yeniden build etmeniz gerekebilir:"
echo "   docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build"

