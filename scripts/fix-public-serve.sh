#!/bin/bash

# Public Klasörü Serve Sorununu Düzelt

set -e

echo "🔧 Public Klasörü Serve Sorununu Düzeltiyoruz..."
echo ""

# 1. Standalone public klasörü var mı?
echo "=== 1. Standalone Public Klasörü Kontrolü ==="
if docker exec alpdinamik-app test -d "/app/.next/standalone/public"; then
    echo "✅ Standalone public klasörü mevcut"
    docker exec alpdinamik-app ls -la /app/.next/standalone/public | head -5
else
    echo "⚠️  Standalone public klasörü yok, oluşturuluyor..."
    docker exec alpdinamik-app mkdir -p /app/.next/standalone/public
    docker exec alpdinamik-app cp -r /app/public/* /app/.next/standalone/public/ 2>/dev/null || true
    echo "✅ Standalone public klasörü oluşturuldu"
fi
echo ""

# 2. Uploads klasörünü standalone'a kopyala
echo "=== 2. Uploads Klasörünü Standalone'a Kopyalıyoruz ==="
docker exec alpdinamik-app mkdir -p /app/.next/standalone/public/uploads
docker exec alpdinamik-app cp -r /app/public/uploads/* /app/.next/standalone/public/uploads/ 2>/dev/null || true
echo "✅ Uploads klasörü kopyalandı"
echo ""

# 3. Test
echo "=== 3. Test ==="
echo "Standalone public/uploads klasörü:"
docker exec alpdinamik-app ls -la /app/.next/standalone/public/uploads/settings | head -5
echo ""

# 4. Container'ı yeniden başlat (gerekirse)
echo "=== 4. Container Yeniden Başlatma ==="
read -p "Container'ı yeniden başlatmak istiyor musunuz? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd /var/www/alpdinamik
    docker-compose -f docker-compose.prod.yml --env-file .env.production restart app
    echo "⏳ Container yeniden başlatıldı, 10 saniye bekleniyor..."
    sleep 10
    echo "✅ Container hazır"
else
    echo "⚠️  Container yeniden başlatılmadı"
fi
echo ""

# 5. Erişim testi
echo "=== 5. Erişim Testi ==="
echo "Test: /uploads/settings/1766040664723-favicon.jpg"
curl -I http://localhost:3001/uploads/settings/1766040664723-favicon.jpg 2>&1 | head -5
echo ""

echo "✅ İşlem tamamlandı!"
echo ""
echo "📝 Not: Bu geçici bir çözüm. Kalıcı çözüm için Dockerfile güncellenmeli ve container yeniden build edilmeli."

