# Sunucuda Database Oluşturma - Direkt Komutlar

## Dump Dosyasını Sunucuya Yükle

```bash
# Yerel makineden (PowerShell)
scp alpdinamik-backup.sql root@srv:/var/www/alpdinamik/
```

## Sunucuda Çalıştırılacak Komutlar

### Yöntem 1: Script ile (Önerilen)

```bash
# Sunucuda
cd /var/www/alpdinamik
chmod +x create-db-from-dump.sh
./create-db-from-dump.sh alpdinamik-backup.sql
```

### Yöntem 2: Tek Tek Komutlar

```bash
# Sunucuda
cd /var/www/alpdinamik

# 1. Mevcut bağlantıları kes
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'alpdinamik_db' AND pid <> pg_backend_pid();
" || true

# 2. Database'i sil
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "DROP DATABASE IF EXISTS alpdinamik_db;" || true

# 3. Yeni database oluştur
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "
CREATE DATABASE alpdinamik_db 
WITH TEMPLATE = template0 
ENCODING = 'UTF8' 
LOCALE_PROVIDER = libc 
LOCALE = 'en_US.utf8';
"

# 4. Dump'ı import et (DROP DATABASE ve CREATE DATABASE satırlarını atla)
grep -v "^DROP DATABASE" alpdinamik-backup.sql | \
grep -v "^CREATE DATABASE" | \
grep -v "^ALTER DATABASE.*OWNER" | \
grep -v "^\\\\connect" | \
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" 2>&1 | \
grep -v "ERROR.*role" || true

# 5. Kontrol et
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "
SELECT 
    'representatives' as tablo, COUNT(*) as kayit FROM representatives
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'product_categories', COUNT(*) FROM product_categories;
"
```

### Yöntem 3: Tek Satırda (Hızlı)

```bash
cd /var/www/alpdinamik && \
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'alpdinamik_db' AND pid <> pg_backend_pid();" 2>/dev/null || true && \
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "DROP DATABASE IF EXISTS alpdinamik_db;" 2>/dev/null || true && \
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "CREATE DATABASE alpdinamik_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';" && \
grep -v "^DROP DATABASE" alpdinamik-backup.sql | grep -v "^CREATE DATABASE" | grep -v "^ALTER DATABASE.*OWNER" | grep -v "^\\\\connect" | docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" 2>&1 | grep -v "ERROR.*role" || true
```

## Dump Dosyası İsmi Farklıysa

Dump dosyanın ismi farklıysa (örneğin `alpdinamik-dump.sql`), komutlarda değiştir:

```bash
./create-db-from-dump.sh alpdinamik-dump.sql
```

veya manuel komutlarda:

```bash
grep -v "^DROP DATABASE" alpdinamik-dump.sql | ...
```

