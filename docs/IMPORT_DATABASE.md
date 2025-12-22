# Sunucuda Database Import İşlemi

## Adımlar

### 1. Dump Dosyasını Sunucuya Yükle

Dump dosyanı sunucuya yükle:

```bash
# Yerel makineden
scp alpdinamik-backup.sql root@srv:/var/www/alpdinamik/
```

### 2. Dump Dosyasını Temizle (Opsiyonel)

Dump dosyasındaki `DROP DATABASE` ve `CREATE DATABASE` komutlarını kaldır:

```bash
# Sunucuda
cd /var/www/alpdinamik
sed -i '/^DROP DATABASE/d; /^CREATE DATABASE/d; /^ALTER DATABASE.*OWNER/d; /^\\connect/d' alpdinamik-backup.sql
```

### 3. Database'i Sil ve Yeniden Oluştur

```bash
# Sunucuda
cd /var/www/alpdinamik

# Mevcut database'i sil
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'alpdinamik_db' AND pid <> pg_backend_pid();
" || true

docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "DROP DATABASE IF EXISTS alpdinamik_db;" || true

# Yeni database oluştur
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
CREATE DATABASE alpdinamik_db 
WITH TEMPLATE = template0 
ENCODING = 'UTF8' 
LOCALE_PROVIDER = libc 
LOCALE = 'en_US.utf8';
"
```

### 4. Dump Dosyasını Import Et

```bash
# Sunucuda
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < alpdinamik-backup.sql 2>&1 | grep -v "ERROR.*role" || true
```

### 5. Kontrol Et

```bash
# Tablo sayısını kontrol et
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
"

# Bazı tablolardaki kayıt sayılarını kontrol et
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "
SELECT 
    'representatives' as table_name, COUNT(*) as row_count FROM representatives
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'product_categories', COUNT(*) FROM product_categories
UNION ALL
SELECT 'product_series', COUNT(*) FROM product_series
UNION ALL
SELECT 'product_variants', COUNT(*) FROM product_variants;
"
```

## Tek Komutla Çalıştırma (Script Kullanarak)

```bash
# Script'i çalıştırılabilir yap
chmod +x recreate-database.sh

# Çalıştır
./recreate-database.sh alpdinamik-backup.sql
```

## DBeaver ile Import

Eğer DBeaver kullanıyorsan:

1. DBeaver'da sunucu database'ine bağlan
2. SQL Editor aç (Ctrl+`)
3. Dump dosyasını aç (File → Open SQL Script)
4. `DROP DATABASE` ve `CREATE DATABASE` satırlarını sil
5. Tüm SQL'i seç ve çalıştır (Ctrl+Alt+X)

