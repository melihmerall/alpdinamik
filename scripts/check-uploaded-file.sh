#!/bin/bash

# Yüklenen Dosyayı Kontrol Et

FILE_NAME="1766040664723-favicon.jpg"
FOLDER="settings"

echo "🔍 Yüklenen Dosyayı Kontrol Ediyoruz: $FILE_NAME"
echo ""

# 1. Container içinde dosya var mı?
echo "=== 1. Container İçinde Dosya Var mı? ==="
if docker exec alpdinamik-app test -f "/app/public/uploads/$FOLDER/$FILE_NAME"; then
    echo "✅ Dosya container içinde mevcut"
    docker exec alpdinamik-app ls -lah "/app/public/uploads/$FOLDER/$FILE_NAME"
else
    echo "❌ Dosya container içinde bulunamadı!"
fi
echo ""

# 2. Sunucuda dosya var mı? (volume mount)
echo "=== 2. Sunucuda Dosya Var mı? (Volume Mount) ==="
if [ -f "/var/www/alpdinamik/uploads/$FOLDER/$FILE_NAME" ]; then
    echo "✅ Dosya sunucuda mevcut (volume mount çalışıyor)"
    ls -lah "/var/www/alpdinamik/uploads/$FOLDER/$FILE_NAME"
else
    echo "❌ Dosya sunucuda bulunamadı (volume mount çalışmıyor olabilir)"
fi
echo ""

# 3. Settings klasöründeki tüm dosyalar
echo "=== 3. Settings Klasöründeki Tüm Dosyalar ==="
echo "Container içinde:"
docker exec alpdinamik-app ls -lah "/app/public/uploads/$FOLDER/" 2>/dev/null || echo "Klasör boş veya yok"
echo ""
echo "Sunucuda:"
ls -lah "/var/www/alpdinamik/uploads/$FOLDER/" 2>/dev/null || echo "Klasör boş veya yok"
echo ""

# 4. Volume mount kontrolü
echo "=== 4. Volume Mount Kontrolü ==="
docker inspect alpdinamik-app | grep -A 10 "Mounts" | grep -i "uploads" || echo "⚠️  Volume mount bulunamadı"
echo ""

# 5. Next.js public klasörü serve ediliyor mu?
echo "=== 5. Next.js Public Klasörü Kontrolü ==="
docker exec alpdinamik-app ls -la /app/public | head -10
echo ""

# 6. Test: Dosya erişilebilir mi?
echo "=== 6. Dosya Erişilebilirlik Testi ==="
echo "Container içinden dosya okuma testi:"
docker exec alpdinamik-app cat "/app/public/uploads/$FOLDER/$FILE_NAME" > /dev/null 2>&1 && echo "✅ Dosya okunabilir" || echo "❌ Dosya okunamıyor"
echo ""

echo "✅ Kontrol tamamlandı!"

