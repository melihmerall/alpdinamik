#!/bin/bash

# Upload Klasörü İzinlerini Düzelt

set -e

echo "🔧 Upload Klasörü İzinlerini Düzeltiyoruz..."
echo ""

# 1. Upload klasörünü oluştur
echo "=== 1. Upload Klasörü Oluşturuluyor ==="
mkdir -p /var/www/alpdinamik/uploads/{settings,products,banners,blog,company-pages,representatives}
echo "✅ Klasörler oluşturuldu"
echo ""

# 2. İzinleri nextjs user'a ver (1001:1001)
echo "=== 2. İzinler Ayarlanıyor ==="
# nextjs user ID: 1001:1001 (Dockerfile'dan)
chown -R 1001:1001 /var/www/alpdinamik/uploads
chmod -R 755 /var/www/alpdinamik/uploads
echo "✅ İzinler ayarlandı (1001:1001 - nextjs user)"
echo ""

# 3. Kontrol
echo "=== 3. Kontrol ==="
ls -la /var/www/alpdinamik/uploads | head -5
echo ""

# 4. Container'ı yeniden başlat
echo "=== 4. Container'ı Yeniden Başlatıyoruz ==="
read -p "Container'ı yeniden başlatmak istiyor musunuz? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd /var/www/alpdinamik
    docker-compose -f docker-compose.prod.yml --env-file .env.production down
    docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
    
    echo "⏳ Container'ların hazır olması bekleniyor (30 saniye)..."
    sleep 30
    
    echo "✅ Container'lar başlatıldı"
else
    echo "⚠️  Container yeniden başlatılmadı. Manuel olarak başlatmanız gerekecek:"
    echo "   cd /var/www/alpdinamik"
    echo "   docker-compose -f docker-compose.prod.yml --env-file .env.production down"
    echo "   docker-compose -f docker-compose.prod.yml --env-file .env.production up -d"
fi
echo ""

# 5. Test
echo "=== 5. Test ==="
echo "Container içinde uploads klasörü:"
docker exec alpdinamik-app ls -la /app/public/uploads 2>/dev/null || echo "⚠️  Klasör bulunamadı"
echo ""

echo "✅ İşlem tamamlandı!"
echo ""
echo "📝 Sonraki Adımlar:"
echo "1. Admin panelden bir dosya yüklemeyi deneyin"
echo "2. Hata alırsanız, container loglarını kontrol edin:"
echo "   docker logs alpdinamik-app --tail 50 | grep -i upload"

