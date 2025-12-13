#!/bin/bash

# Mevcut Docker Container ve Image Kontrol Script'i
# Bu script, sunucudaki mevcut Docker durumunu kontrol eder

set -e

echo "🔍 Mevcut Docker Durumu Kontrol Ediliyor..."
echo ""

# Docker kurulu mu?
if ! command -v docker &> /dev/null; then
    echo "❌ Docker kurulu değil!"
    exit 1
fi

echo "✅ Docker kurulu: $(docker --version)"
echo ""

# Docker Compose kurulu mu?
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose kurulu değil!"
else
    echo "✅ Docker Compose kurulu: $(docker-compose --version)"
fi
echo ""

# Çalışan container'lar
echo "📦 Çalışan Container'lar:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Tüm container'lar (durmuş olanlar dahil)
echo "📦 Tüm Container'lar (durmuş olanlar dahil):"
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Docker image'ları
echo "🖼️  Docker Image'ları:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
echo ""

# Volume'lar
echo "💾 Docker Volume'ları:"
docker volume ls
echo ""

# Network'ler
echo "🌐 Docker Network'leri:"
docker network ls
echo ""

# AlpDinamik ile ilgili container'lar
echo "🎯 AlpDinamik ile İlgili Container'lar:"
docker ps -a --filter "name=alpdinamik" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
echo ""

# Port kullanımı (3000, 5432, 80, 443)
echo "🔌 Port Kullanımı:"
echo "Port 3000: $(lsof -i :3000 2>/dev/null || echo 'Boş')"
echo "Port 5432: $(lsof -i :5432 2>/dev/null || echo 'Boş')"
echo "Port 80: $(lsof -i :80 2>/dev/null || echo 'Boş')"
echo "Port 443: $(lsof -i :443 2>/dev/null || echo 'Boş')"
echo ""

echo "✅ Kontrol tamamlandı!"

