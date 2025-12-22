#!/bin/bash

# Admin şifresi için bcrypt hash oluşturma scripti
# Kullanım: ./generate-password-hash.sh <şifre>

PASSWORD="${1:-admin123}"

echo "🔐 Şifre hash'i oluşturuluyor..."
echo "Şifre: $PASSWORD"
echo ""

# Docker container içinde hash oluştur
HASH=$(docker exec alpdinamik-app node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('$PASSWORD', 12));" 2>/dev/null)

if [ -z "$HASH" ]; then
    echo "❌ Hata: Hash oluşturulamadı!"
    echo "Container çalışıyor mu kontrol et: docker ps | grep alpdinamik-app"
    exit 1
fi

echo "✅ Hash oluşturuldu:"
echo "$HASH"
echo ""
echo "📋 SQL Komutu:"
echo "UPDATE users SET \"passwordHash\" = '$HASH', \"updatedAt\" = NOW() WHERE email = 'admin@alpdinamik.com.tr';"
echo ""
echo "🚀 Hızlı Güncelleme:"
echo "docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c \"UPDATE users SET \\\"passwordHash\\\" = '$HASH', \\\"updatedAt\\\" = NOW() WHERE email = 'admin@alpdinamik.com.tr';\""

