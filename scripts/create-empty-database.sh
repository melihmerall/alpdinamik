#!/bin/bash

# Docker içinde boş PostgreSQL database oluşturma scripti
# Tabloları DBeaver ile ekleyebilirsin

set -e

echo "🚀 Boş database oluşturuluyor..."
echo ""

# Mevcut bağlantıları kes
echo "🔌 Mevcut database bağlantılarını kesiyoruz..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'alpdinamik_db' AND pid <> pg_backend_pid();
" > /dev/null 2>&1 || true

# Mevcut database'i sil
echo "🗑️  Mevcut database'i siliyoruz (varsa)..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "DROP DATABASE IF EXISTS alpdinamik_db;" > /dev/null 2>&1 || true

# Yeni boş database oluştur
echo "✅ Yeni boş database oluşturuluyor..."
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
CREATE DATABASE alpdinamik_db 
WITH TEMPLATE = template0 
ENCODING = 'UTF8' 
LOCALE_PROVIDER = libc 
LOCALE = 'en_US.utf8';
"

echo ""
echo "✅ Boş database başarıyla oluşturuldu!"
echo ""
echo "📋 Database Bilgileri:"
echo "   Database Adı: alpdinamik_db"
echo "   Kullanıcı: alpdinamik_user"
echo "   Host: localhost (veya sunucu IP)"
echo "   Port: 5432"
echo ""
echo "🔗 DBeaver'da bağlanmak için:"
echo "   1. DBeaver'da yeni PostgreSQL bağlantısı oluştur"
echo "   2. Host: localhost (veya sunucu IP)"
echo "   3. Port: 5432"
echo "   4. Database: alpdinamik_db"
echo "   5. Username: alpdinamik_user"
echo "   6. Password: .env.production dosyasındaki DB_PASSWORD"
echo ""
echo "📥 Dump dosyasını import etmek için:"
echo "   1. DBeaver'da database'e bağlan"
echo "   2. SQL Editor aç (Ctrl+`)"
echo "   3. Dump dosyasını aç"
echo "   4. DROP DATABASE ve CREATE DATABASE satırlarını sil"
echo "   5. Tüm SQL'i seç ve çalıştır (Ctrl+Alt+X)"
echo ""

