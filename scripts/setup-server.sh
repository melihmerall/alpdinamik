#!/bin/bash

# Sunucu Kurulum Script'i
# Bu script, sunucuya ilk kurulum yapar ve mevcut durumu kontrol eder

set -e

echo "🚀 Sunucu Kurulum Başlatılıyor..."
echo ""

# Sistem güncellemeleri
echo "📦 Sistem güncellemeleri yapılıyor..."
sudo apt update
sudo apt upgrade -y

# Docker kurulumu kontrolü
if ! command -v docker &> /dev/null; then
    echo "🐳 Docker kuruluyor..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker kuruldu!"
else
    echo "✅ Docker zaten kurulu: $(docker --version)"
fi

# Docker Compose kurulumu kontrolü
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Docker Compose kuruluyor..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose kuruldu!"
else
    echo "✅ Docker Compose zaten kurulu: $(docker-compose --version)"
fi

# Gerekli dizinler
echo "📁 Gerekli dizinler oluşturuluyor..."
mkdir -p nginx/ssl
mkdir -p nginx/logs
mkdir -p nginx/conf.d
mkdir -p public/uploads
mkdir -p backups
chmod 755 public/uploads

# Mevcut container'ları kontrol et
echo ""
echo "🔍 Mevcut Docker durumu kontrol ediliyor..."
./scripts/check-existing-containers.sh

# .env.production kontrolü
if [ ! -f ".env.production" ]; then
    echo ""
    echo "⚠️  .env.production dosyası bulunamadı!"
    if [ -f ".env.production.template" ]; then
        echo "📝 Template'den oluşturuluyor..."
        cp .env.production.template .env.production
        echo "✅ .env.production oluşturuldu. Lütfen değerleri doldurun!"
    else
        echo "❌ .env.production.template de bulunamadı!"
    fi
else
    echo "✅ .env.production mevcut"
fi

echo ""
echo "✅ Sunucu kurulumu tamamlandı!"
echo ""
echo "📋 Sonraki adımlar:"
echo "1. .env.production dosyasını düzenleyin"
echo "2. Mevcut verileri kontrol edin: ./scripts/check-existing-containers.sh"
echo "3. Deployment yapın: ./scripts/deploy.sh"
echo "4. Mevcut verileri taşıyın: ./scripts/migrate-existing-data.sh"

