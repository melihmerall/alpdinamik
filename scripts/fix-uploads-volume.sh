#!/bin/bash

# Upload Klasörü Volume Mount Düzeltme Scripti

set -e

echo "🔧 Upload Klasörü Volume Mount Düzeltiyoruz..."
echo ""

# 1. Upload klasörünü oluştur
echo "=== 1. Upload Klasörü Oluşturuluyor ==="
mkdir -p /var/www/alpdinamik/uploads
mkdir -p /var/www/alpdinamik/uploads/settings
mkdir -p /var/www/alpdinamik/uploads/products
mkdir -p /var/www/alpdinamik/uploads/banners
mkdir -p /var/www/alpdinamik/uploads/blog
mkdir -p /var/www/alpdinamik/uploads/company-pages
mkdir -p /var/www/alpdinamik/uploads/representatives
echo "✅ Upload klasörleri oluşturuldu"
echo ""

# 2. Mevcut container içindeki dosyaları kopyala (varsa)
echo "=== 2. Mevcut Dosyaları Kontrol Ediyoruz ==="
if docker ps | grep -q "alpdinamik-app"; then
    echo "📦 Container içindeki dosyalar kontrol ediliyor..."
    docker exec alpdinamik-app ls -la /app/public/uploads 2>/dev/null || echo "⚠️  Container içinde uploads klasörü yok"
    
    # Container içindeki dosyaları kopyala
    echo "📥 Container içindeki dosyalar kopyalanıyor..."
    docker cp alpdinamik-app:/app/public/uploads/. /var/www/alpdinamik/uploads/ 2>/dev/null || echo "⚠️  Kopyalama yapılamadı (klasör boş olabilir)"
    echo "✅ Dosyalar kopyalandı"
else
    echo "⚠️  Container çalışmıyor, dosya kopyalama atlandı"
fi
echo ""

# 3. İzinleri ayarla
echo "=== 3. İzinler Ayarlanıyor ==="
chmod -R 755 /var/www/alpdinamik/uploads
chown -R root:root /var/www/alpdinamik/uploads
echo "✅ İzinler ayarlandı"
echo ""

# 4. Container'ı yeniden başlat
echo "=== 4. Container'ı Yeniden Başlatıyoruz ==="
read -p "Container'ı yeniden başlatmak istiyor musunuz? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⏳ Container'lar durduruluyor..."
    cd /var/www/alpdinamik
    docker-compose -f docker-compose.prod.yml down
    
    echo "⏳ Container'lar başlatılıyor..."
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "⏳ Container'ların hazır olması bekleniyor (30 saniye)..."
    sleep 30
    
    echo "✅ Container'lar başlatıldı"
else
    echo "⚠️  Container yeniden başlatılmadı. Manuel olarak başlatmanız gerekecek:"
    echo "   cd /var/www/alpdinamik"
    echo "   docker-compose -f docker-compose.prod.yml down"
    echo "   docker-compose -f docker-compose.prod.yml up -d"
fi
echo ""

# 5. Kontrol
echo "=== 5. Kontrol ==="
if [ -d "/var/www/alpdinamik/uploads" ]; then
    echo "✅ Upload klasörü mevcut: /var/www/alpdinamik/uploads"
    FILE_COUNT=$(find /var/www/alpdinamik/uploads -type f | wc -l)
    echo "📊 Dosya sayısı: $FILE_COUNT"
else
    echo "❌ Upload klasörü bulunamadı!"
fi
echo ""

echo "✅ İşlem tamamlandı!"
echo ""
echo "📝 Sonraki Adımlar:"
echo "1. Container'ı yeniden başlatın (yukarıdaki komutlar)"
echo "2. Admin panelden yeni bir dosya yükleyin"
echo "3. Dosyanın /var/www/alpdinamik/uploads klasöründe göründüğünü kontrol edin"

