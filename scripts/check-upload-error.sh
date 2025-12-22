#!/bin/bash

# Upload 500 Hatasını Detaylı Kontrol Et

echo "🔍 Upload 500 Hatasını Detaylı Kontrol Ediyoruz..."
echo ""

# 1. Son upload hataları
echo "=== 1. Son Upload Hataları (Son 100 satır) ==="
docker logs alpdinamik-app --tail 100 | grep -i -A 10 -B 5 "upload\|error\|500\|failed\|exception" | tail -30
echo ""

# 2. API route çalışıyor mu?
echo "=== 2. Upload API Route Testi ==="
echo "Health check:"
curl -s http://localhost:3001/api/health | head -3 || echo "❌ Health check başarısız"
echo ""

# 3. Authentication kontrolü
echo "=== 3. Authentication Kontrolü ==="
echo "Upload API'ye istek atılıyor (unauthorized bekleniyor):"
curl -s -X POST http://localhost:3001/api/upload -F "file=@/dev/null" 2>&1 | head -5
echo ""

# 4. Container içinde uploads klasörü detayları
echo "=== 4. Container İçinde Uploads Klasörü Detayları ==="
docker exec alpdinamik-app ls -la /app/public/uploads
echo ""

# 5. Settings klasörü (favicon yüklenmiş)
echo "=== 5. Settings Klasörü (Son Yüklenen Dosyalar) ==="
docker exec alpdinamik-app ls -lah /app/public/uploads/settings | tail -5
echo ""

# 6. Node.js process bilgisi
echo "=== 6. Node.js Process Bilgisi ==="
docker exec alpdinamik-app ps aux | grep node | head -3
echo ""

# 7. Disk alanı
echo "=== 7. Disk Alanı ==="
docker exec alpdinamik-app df -h /app/public/uploads
echo ""

echo "✅ Kontrol tamamlandı!"

