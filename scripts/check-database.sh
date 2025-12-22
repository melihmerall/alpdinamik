#!/bin/bash

# Database ve Container Kontrol Scripti

echo "🔍 Database ve Container Durumunu Kontrol Ediyoruz..."
echo ""

# 1. Container durumları
echo "=== 1. Container Durumları ==="
docker ps -a | grep -E "alpdinamik|CONTAINER"
echo ""

# 2. Database container logları
echo "=== 2. Database Container Logları (Son 20 satır) ==="
docker logs alpdinamik-postgres --tail 20 2>&1 || echo "❌ Database container çalışmıyor"
echo ""

# 3. Database volume kontrolü
echo "=== 3. Database Volume Kontrolü ==="
docker volume ls | grep alpdinamik || echo "❌ Database volume bulunamadı"
echo ""

# 4. Database container içinde database listesi
echo "=== 4. Database Container İçinde Database'ler ==="
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "\l" 2>&1 || echo "❌ Database container'a bağlanılamıyor"
echo ""

# 5. Environment variable kontrolü
echo "=== 5. Environment Variable Kontrolü ==="
if [ -f ".env.production" ]; then
    echo "✅ .env.production dosyası mevcut"
    echo "İçerik (gizli bilgiler hariç):"
    grep -v "PASSWORD\|SECRET" .env.production | head -10
else
    echo "❌ .env.production dosyası bulunamadı!"
fi
echo ""

# 6. Network kontrolü
echo "=== 6. Docker Network Kontrolü ==="
docker network ls | grep alpdinamik || echo "❌ Network bulunamadı"
echo ""

# 7. Database bağlantı testi
echo "=== 7. Database Bağlantı Testi ==="
if docker ps | grep -q "alpdinamik-postgres"; then
    echo "✅ Database container çalışıyor"
    docker exec alpdinamik-postgres pg_isready -U alpdinamik_user 2>&1 || echo "❌ Database hazır değil"
    
    # Database var mı kontrol et
    DB_EXISTS=$(docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='alpdinamik_db'" 2>/dev/null)
    if [ "$DB_EXISTS" = "1" ]; then
        echo "✅ alpdinamik_db database'i mevcut"
        
        # Tablo sayısını kontrol et
        TABLE_COUNT=$(docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null)
        echo "📊 Tablo sayısı: $TABLE_COUNT"
    else
        echo "❌ alpdinamik_db database'i bulunamadı!"
    fi
else
    echo "❌ Database container çalışmıyor"
fi
echo ""

echo "✅ Kontrol tamamlandı!"

