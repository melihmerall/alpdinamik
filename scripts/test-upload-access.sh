#!/bin/bash

# Upload Dosyası Erişim Testi

echo "🔍 Upload Dosyası Erişim Testi..."
echo ""

FILE="1766040664723-favicon.jpg"
URL="http://localhost:3001/uploads/settings/$FILE"

# 1. HTTP Status Code
echo "=== 1. HTTP Status Code ==="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
echo "Status Code: $STATUS"
if [ "$STATUS" = "200" ]; then
    echo "✅ Dosya erişilebilir!"
elif [ "$STATUS" = "404" ]; then
    echo "❌ Dosya bulunamadı (404)"
else
    echo "⚠️  Beklenmeyen status: $STATUS"
fi
echo ""

# 2. Dosya boyutu
echo "=== 2. Dosya Boyutu ==="
SIZE=$(curl -s -o /dev/null -w "%{size_download}" "$URL")
echo "İndirilen boyut: $SIZE bytes"
echo ""

# 3. Content-Type
echo "=== 3. Content-Type ==="
CONTENT_TYPE=$(curl -s -o /dev/null -w "%{content_type}" "$URL")
echo "Content-Type: $CONTENT_TYPE"
echo ""

# 4. Browser'dan test
echo "=== 4. Browser Test ==="
echo "Browser'da şu URL'yi aç:"
echo "http://178.157.14.211:3001/uploads/settings/$FILE"
echo ""

echo "✅ Test tamamlandı!"

