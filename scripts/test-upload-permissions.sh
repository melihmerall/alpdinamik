#!/bin/bash

# Upload İzinlerini ve Klasörleri Test Et

echo "🔍 Upload İzinlerini ve Klasörleri Test Ediyoruz..."
echo ""

# 1. Sunucuda uploads klasörü
echo "=== 1. Sunucuda Uploads Klasörü ==="
if [ -d "/var/www/alpdinamik/uploads" ]; then
    echo "✅ Klasör mevcut"
    ls -la /var/www/alpdinamik/uploads | head -5
    echo ""
    echo "Sahip:"
    stat -c "%U:%G (%u:%g)" /var/www/alpdinamik/uploads
else
    echo "❌ Klasör bulunamadı!"
fi
echo ""

# 2. Container içinde uploads klasörü
echo "=== 2. Container İçinde Uploads Klasörü ==="
docker exec alpdinamik-app ls -la /app/public/uploads 2>/dev/null || echo "❌ Klasör bulunamadı veya erişilemiyor"
echo ""

# 3. Yazma izni testi
echo "=== 3. Yazma İzni Testi ==="
echo "Test dosyası oluşturuluyor..."
docker exec alpdinamik-app touch /app/public/uploads/test-write.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Yazma izni var!"
    docker exec alpdinamik-app rm -f /app/public/uploads/test-write.txt
else
    echo "❌ Yazma izni yok!"
    echo "Hata detayı:"
    docker exec alpdinamik-app touch /app/public/uploads/test-write.txt 2>&1
fi
echo ""

# 4. Klasör oluşturma testi
echo "=== 4. Klasör Oluşturma Testi ==="
docker exec alpdinamik-app mkdir -p /app/public/uploads/test-folder 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Klasör oluşturma izni var!"
    docker exec alpdinamik-app rmdir /app/public/uploads/test-folder 2>/dev/null
else
    echo "❌ Klasör oluşturma izni yok!"
    echo "Hata detayı:"
    docker exec alpdinamik-app mkdir -p /app/public/uploads/test-folder 2>&1
fi
echo ""

# 5. Container içinde user bilgisi
echo "=== 5. Container İçinde User Bilgisi ==="
docker exec alpdinamik-app id
echo ""

# 6. Son upload hataları
echo "=== 6. Son Upload Hataları (Loglar) ==="
docker logs alpdinamik-app --tail 100 | grep -i "error\|upload\|500\|failed" | tail -10 || echo "Hata bulunamadı"
echo ""

echo "✅ Test tamamlandı!"

