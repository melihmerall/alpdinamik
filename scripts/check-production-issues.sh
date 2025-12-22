#!/bin/bash
# Production sorunlarını kontrol etmek için script

echo "🔍 Production Sorun Kontrolü"
echo ""

# 1. Container içinde public klasörünü kontrol et
echo "📁 Container içinde public klasörü kontrol ediliyor..."
docker exec alpdinamik-app ls -la /app/public/assets 2>/dev/null | head -10 || echo "❌ public/assets klasörü bulunamadı!"

echo ""
echo "📁 CSS dosyaları kontrol ediliyor..."
docker exec alpdinamik-app ls -la /app/public/assets/css 2>/dev/null | head -10 || echo "❌ CSS dosyaları bulunamadı!"
docker exec alpdinamik-app ls -la /app/public/assets/sass 2>/dev/null | head -10 || echo "❌ SASS dosyaları bulunamadı!"

echo ""
echo "🗄️  Database bağlantısı kontrol ediliyor..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM \"Representative\";" 2>/dev/null || echo "❌ Database bağlantısı başarısız veya veri yok!"

echo ""
echo "✅ Kontrol tamamlandı"

