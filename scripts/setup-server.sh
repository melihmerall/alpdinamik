#!/bin/bash
# Alpdinamik Sunucu Kurulum Script'i

set -e

echo "🚀 Alpdinamik Sunucu Kurulumu Başlıyor..."
echo ""

# 1. Sistem güncellemesi
echo "📦 Sistem güncelleniyor..."
apt update && apt upgrade -y
echo "✅ Sistem güncellendi"
echo ""

# 2. Docker kurulumu
echo "🐳 Docker kuruluyor..."
apt install -y docker.io docker-compose git curl wget nano ufw
systemctl enable docker
systemctl start docker
echo "✅ Docker kuruldu"
docker --version
echo ""

# 3. Docker Compose kontrolü
echo "📦 Docker Compose kontrolü..."
docker-compose --version || echo "Docker Compose kurulacak"
echo ""

# 4. Docker test
echo "🧪 Docker test ediliyor..."
docker run --rm hello-world
echo "✅ Docker çalışıyor!"
echo ""

# 5. Proje klasörü oluştur
echo "📁 Proje klasörü oluşturuluyor..."
mkdir -p /var/www/alpdinamik
cd /var/www/alpdinamik
pwd
echo "✅ Klasör oluşturuldu"
echo ""

# 6. Firewall ayarları
echo "🔥 Firewall ayarlanıyor..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3001/tcp
ufw --force enable
ufw status numbered
echo "✅ Firewall ayarlandı"
echo ""

# 7. Sistem bilgileri
echo "📊 Sistem Bilgileri:"
cat /etc/os-release | grep PRETTY_NAME
free -h | grep Mem
df -h / | tail -1
echo ""

echo "✅ Sunucu hazırlığı tamamlandı!"
echo ""
echo "📝 Sonraki adımlar:"
echo "   1. Projeyi /var/www/alpdinamik klasörüne aktarın"
echo "   2. .env.production dosyasını oluşturun"
echo "   3. Database dump'ını import edin"
echo ""

