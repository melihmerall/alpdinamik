#!/bin/bash

# Next.js Public Klasörü Serve Kontrolü

echo "🔍 Next.js Public Klasörü Serve Kontrolü..."
echo ""

# 1. Standalone build yapısı
echo "=== 1. Standalone Build Yapısı ==="
docker exec alpdinamik-app ls -la /app | head -10
echo ""

# 2. Public klasörü nerede?
echo "=== 2. Public Klasörü Konumu ==="
docker exec alpdinamik-app find /app -name "public" -type d 2>/dev/null
echo ""

# 3. Server.js public klasörünü serve ediyor mu?
echo "=== 3. Server.js Public Klasörü Serve Ediyor mu? ==="
docker exec alpdinamik-app cat /app/server.js | grep -i "public\|static" | head -10 || echo "Server.js bulunamadı veya public referansı yok"
echo ""

# 4. Next.js config
echo "=== 4. Next.js Config Kontrolü ==="
docker exec alpdinamik-app cat /app/next.config.mjs 2>/dev/null | head -20 || echo "next.config.mjs bulunamadı"
echo ""

# 5. Test: Public dosyasına erişim
echo "=== 5. Public Dosyasına Erişim Testi ==="
echo "Test: /assets/img/logo-2.png (mevcut bir dosya)"
curl -I http://localhost:3001/assets/img/logo-2.png 2>&1 | head -5
echo ""

# 6. Test: Upload dosyasına erişim
echo "=== 6. Upload Dosyasına Erişim Testi ==="
echo "Test: /uploads/settings/1766040664723-favicon.jpg"
curl -I http://localhost:3001/uploads/settings/1766040664723-favicon.jpg 2>&1 | head -5
echo ""

# 7. Next.js standalone public klasörü
echo "=== 7. Standalone Public Klasörü ==="
docker exec alpdinamik-app ls -la /app/.next/standalone/public 2>/dev/null || echo "Standalone public klasörü yok"
echo ""

echo "✅ Kontrol tamamlandı!"

