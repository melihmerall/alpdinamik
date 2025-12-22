#!/bin/bash

# Upload API'yi Test Et

echo "🔍 Upload API'yi Test Ediyoruz..."
echo ""

# 1. Son logları kontrol et (real-time)
echo "=== 1. Son Loglar (Real-time için -f kullan) ==="
echo "Son 50 satır:"
docker logs alpdinamik-app --tail 50
echo ""
echo "Upload ile ilgili:"
docker logs alpdinamik-app --tail 200 | grep -i "upload" | tail -10
echo ""

# 2. Error logları
echo "=== 2. Error Logları ==="
docker logs alpdinamik-app --tail 200 | grep -i "error\|exception\|failed" | tail -10
echo ""

# 3. Upload API'ye test isteği (unauthorized bekleniyor)
echo "=== 3. Upload API Test (Unauthorized) ==="
curl -v -X POST http://localhost:3001/api/upload \
  -F "file=@/dev/null" \
  -F "folder=test" 2>&1 | head -20
echo ""

# 4. Container içinde process.cwd() kontrolü
echo "=== 4. Container İçinde Working Directory ==="
docker exec alpdinamik-app node -e "console.log('cwd:', process.cwd()); console.log('public exists:', require('fs').existsSync('public')); console.log('uploads exists:', require('fs').existsSync('public/uploads'));"
echo ""

# 5. Upload klasörü path kontrolü
echo "=== 5. Upload Klasörü Path Kontrolü ==="
docker exec alpdinamik-app node -e "const path = require('path'); const cwd = process.cwd(); console.log('cwd:', cwd); console.log('public/uploads path:', path.join(cwd, 'public', 'uploads')); console.log('exists:', require('fs').existsSync(path.join(cwd, 'public', 'uploads')));"
echo ""

echo "✅ Test tamamlandı!"
echo ""
echo "📝 Sonraki Adım:"
echo "Admin panelden bir dosya yüklemeyi deneyin ve logları izleyin:"
echo "docker logs alpdinamik-app -f"

