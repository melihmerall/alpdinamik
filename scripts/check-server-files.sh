#!/bin/bash
# Sunucuda dosya kontrolü

SERVER_HOST="178.157.14.211"
SERVER_PORT="23422"
SERVER_USER="root"
SERVER_DIR="/var/www/alpdinamik"

echo "🔍 Sunucuda dosya kontrolü yapılıyor..."
echo ""

ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'ENDSSH'
cd /var/www/alpdinamik

echo "=== Temel Klasörler ==="
ls -d app components lib prisma public 2>/dev/null || echo "❌ Bazı klasörler eksik!"

echo ""
echo "=== app Klasörü İçeriği ==="
if [ -d "app" ]; then
    echo "✅ app klasörü mevcut"
    ls -la app | head -10
else
    echo "❌ app klasörü YOK!"
fi

echo ""
echo "=== Önemli Dosyalar ==="
ls -lh package.json Dockerfile docker-compose.prod.yml next.config.mjs 2>/dev/null || echo "❌ Bazı dosyalar eksik!"

echo ""
echo "=== Toplam Dosya Sayısı ==="
find . -type f | wc -l

ENDSSH

echo ""
echo "✅ Kontrol tamamlandı"

