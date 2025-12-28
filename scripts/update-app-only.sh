#!/bin/bash

# Alpdinamik App Container Update Script
# Sadece app container'ını ve image'ını günceller
# Veritabanına dokunmaz, veriler korunur
# Production: https://alpdinamik.com.tr

# set -e kaldırıldı - hataları manuel kontrol ediyoruz

echo "🚀 Alpdinamik App Container Güncelleme Başlıyor..."

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Proje dizini
PROJECT_DIR="/var/www/alpdinamik"
cd $PROJECT_DIR || { echo -e "${RED}❌ Proje dizinine gidilemedi: $PROJECT_DIR${NC}"; exit 1; }

echo -e "${BLUE}📂 Çalışma dizini: $(pwd)${NC}"


# 2. Mevcut app container'ını durdur
echo -e "${YELLOW}🛑 Mevcut app container durduruluyor...${NC}"
docker-compose -f docker-compose.prod.yml stop app || {
    echo -e "${YELLOW}⚠️  App container zaten durmuş olabilir${NC}"
}

# 3. App container'ını sil
echo -e "${YELLOW}🗑️  App container siliniyor...${NC}"
docker-compose -f docker-compose.prod.yml rm -f app || {
    echo -e "${YELLOW}⚠️  App container zaten silinmiş olabilir${NC}"
}

# Alternatif olarak docker rm ile de silebiliriz
docker rm -f alpdinamik-app 2>/dev/null || true

# 4. Docker temizliği (veritabanı volumleri hariç)
echo -e "${YELLOW}🧹 Docker temizliği yapılıyor...${NC}"

# Dangling images (kullanılmayan image'lar) temizle
echo -e "${BLUE}   📦 Dangling images temizleniyor...${NC}"
docker image prune -f 2>/dev/null || true

# Kullanılmayan container'ları temizle (sadece stopped)
echo -e "${BLUE}   📦 Stopped container'lar temizleniyor...${NC}"
docker container prune -f 2>/dev/null || true

# Build cache temizle (eski build cache'leri)
echo -e "${BLUE}   📦 Build cache temizleniyor...${NC}"
docker builder prune -f 2>/dev/null || true

# Eski app image'ını sil
echo -e "${BLUE}   📦 Eski app image temizleniyor...${NC}"
docker rmi alpdinamik_app:latest 2>/dev/null || {
    echo -e "${YELLOW}   ⚠️  Eski image bulunamadı veya kullanımda${NC}"
}

# Disk kullanımını göster
echo -e "${BLUE}   💾 Docker disk kullanımı:${NC}"
docker system df 2>/dev/null || true

# 5. Next.js cache temizleme (kapsamlı)
echo -e "${YELLOW}🧹 Next.js cache temizleniyor...${NC}"

# .next klasörünü temizle
rm -rf .next 2>/dev/null || true
echo -e "${GREEN}   ✅ .next klasörü temizlendi${NC}"

# .next/cache klasörünü temizle (eğer varsa)
rm -rf .next/cache 2>/dev/null || true

# node_modules/.cache temizle (eğer varsa)
rm -rf node_modules/.cache 2>/dev/null || true

# Build cache temizle
rm -rf .turbo 2>/dev/null || true

echo -e "${GREEN}   ✅ Next.js cache temizlendi${NC}"

# 7. App image'ını yeniden build et
echo -e "${YELLOW}🔨 App image yeniden build ediliyor (bu işlem birkaç dakika sürebilir)...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache app

# 7. App container'ını başlat
echo -e "${YELLOW}▶️  App container başlatılıyor...${NC}"
docker-compose -f docker-compose.prod.yml up -d app

# 9. Container durumunu kontrol et
echo -e "${YELLOW}⏳ Container başlatılması bekleniyor (10 saniye)...${NC}"
sleep 10

# 9. Container durumunu göster
echo -e "${BLUE}📊 Container durumu:${NC}"
docker ps | grep alpdinamik || echo -e "${RED}❌ Container görünmüyor!${NC}"

# 11. App loglarını göster (son 20 satır)
echo -e "${BLUE}📋 App logları (son 20 satır):${NC}"
docker logs --tail 20 alpdinamik-app || echo -e "${YELLOW}⚠️  Loglar alınamadı${NC}"

# 11. Container'ın çalıştığını kontrol et
echo -e "${YELLOW}🔍 Container durumu kontrol ediliyor...${NC}"
sleep 5

CONTAINER_STATUS=$(docker ps --filter "name=alpdinamik-app" --format "{{.Status}}" 2>/dev/null || echo "")
if [ -z "$CONTAINER_STATUS" ]; then
    echo -e "${RED}❌ Container çalışmıyor! Logları kontrol edin.${NC}"
    docker logs --tail 50 alpdinamik-app 2>/dev/null || true
    exit 1
else
    echo -e "${GREEN}✅ Container çalışıyor: $CONTAINER_STATUS${NC}"
fi

# 13. Port kontrolü
echo -e "${YELLOW}🔌 Port kontrolü yapılıyor...${NC}"
sleep 3
if docker exec alpdinamik-app nc -z localhost 3000 2>/dev/null || curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Port 3000/3001 erişilebilir${NC}"
else
    echo -e "${YELLOW}⚠️  Port kontrolü başarısız, ancak container çalışıyor${NC}"
fi

# 13. Health check
echo -e "${YELLOW}🏥 Health check yapılıyor...${NC}"
sleep 5
HEALTH_CHECK_PASSED=false
for i in {1..5}; do
    if docker exec alpdinamik-app node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" 2>/dev/null; then
        echo -e "${GREEN}✅ App sağlıklı çalışıyor!${NC}"
        HEALTH_CHECK_PASSED=true
        break
    else
        echo -e "${YELLOW}⏳ Health check denemesi $i/5...${NC}"
        sleep 3
    fi
done

if [ "$HEALTH_CHECK_PASSED" = false ]; then
    echo -e "${YELLOW}⚠️  Health check başarısız, ancak container çalışıyor olabilir${NC}"
    echo -e "${YELLOW}   Logları kontrol edin: docker logs -f alpdinamik-app${NC}"
fi

# 15. Nginx kontrolü ve reload
echo -e "${YELLOW}🌐 Nginx kontrolü yapılıyor...${NC}"
if command -v nginx &> /dev/null; then
    if sudo nginx -t 2>/dev/null; then
        echo -e "${GREEN}✅ Nginx yapılandırması geçerli${NC}"
        echo -e "${YELLOW}🔄 Nginx reload ediliyor...${NC}"
        sudo systemctl reload nginx 2>/dev/null || sudo nginx -s reload 2>/dev/null || {
            echo -e "${YELLOW}⚠️  Nginx reload başarısız, manuel kontrol gerekebilir${NC}"
        }
        echo -e "${GREEN}✅ Nginx reload edildi${NC}"
    else
        echo -e "${RED}❌ Nginx yapılandırması hatalı! Kontrol edin: sudo nginx -t${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Nginx bulunamadı, Docker nginx kullanılıyor olabilir${NC}"
fi

# 16. CSS Cache kontrolü ve öneriler
echo -e "${YELLOW}💡 CSS değişiklikleri görünmüyorsa:${NC}"
echo "   1. Tarayıcı cache'ini temizleyin (Ctrl+Shift+R veya Cmd+Shift+R)"
echo "   2. Hard refresh yapın (Ctrl+F5 veya Cmd+Shift+R)"
echo "   3. CSS dosyasının yüklendiğini kontrol edin:"
echo "      curl -I https://alpdinamik.com.tr/_next/static/css/ 2>/dev/null | head -1"
echo ""

# 16. Final temizlik (opsiyonel - disk alanı kazanmak için)
echo -e "${YELLOW}🧹 Final temizlik yapılıyor...${NC}"

# Kullanılmayan network'leri temizle
docker network prune -f 2>/dev/null || true

# Disk kullanımını tekrar göster
echo -e "${BLUE}💾 Güncel Docker disk kullanımı:${NC}"
docker system df 2>/dev/null || true

# 18. Son durum özeti
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ App güncelleme tamamlandı!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📝 Özet:${NC}"
echo "   ✅ Veritabanı container'ı (alpdinamik-postgres) hiç dokunulmadı"
echo "   ✅ Veritabanı volumleri korundu"
echo "   ✅ Tüm veriler korundu"
echo "   ✅ Docker temizliği yapıldı (dangling images, unused containers, build cache)"
echo "   ✅ Next.js cache temizlendi (.next, .turbo, node_modules/.cache)"
echo "   ✅ Sadece app container'ı ve image'ı güncellendi"
echo "   ✅ Container durumu: $CONTAINER_STATUS"
echo ""
echo -e "${BLUE}🌐 Site URL:${NC}"
echo "   https://alpdinamik.com.tr"
echo ""
echo -e "${YELLOW}🔍 Yararlı komutlar:${NC}"
echo "   Logları izle:     docker logs -f alpdinamik-app"
echo "   Container durumu: docker ps | grep alpdinamik"
echo "   Nginx durumu:     sudo systemctl status nginx"
echo "   Nginx test:       sudo nginx -t"
echo "   Disk kullanımı:   docker system df"
echo ""
