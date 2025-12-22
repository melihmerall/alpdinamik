# Boş Database Oluşturma - DBeaver ile Import

## Sunucuda Boş Database Oluştur

### Script ile (Önerilen)

```bash
# Sunucuda
cd /var/www/alpdinamik
chmod +x create-empty-database.sh
./create-empty-database.sh
```

### Manuel Komutlar

```bash
# Sunucuda
cd /var/www/alpdinamik

# 1. Mevcut bağlantıları kes
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'alpdinamik_db' AND pid <> pg_backend_pid();" || true

# 2. Database'i sil (varsa)
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "DROP DATABASE IF EXISTS alpdinamik_db;" || true

# 3. Yeni boş database oluştur
docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "CREATE DATABASE alpdinamik_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';"
```

## DBeaver'da Bağlan

### Bağlantı Bilgileri

- **Host:** `localhost` (veya sunucu IP adresi)
- **Port:** `5432`
- **Database:** `alpdinamik_db`
- **Username:** `alpdinamik_user`
- **Password:** `.env.production` dosyasındaki `DB_PASSWORD` değeri

### SSH Tunnel (Eğer uzaktan bağlanıyorsan)

1. DBeaver'da yeni PostgreSQL bağlantısı oluştur
2. **SSH** sekmesine git
3. **Use SSH Tunnel** işaretle
4. **Host:** Sunucu IP
5. **Port:** 22
6. **User:** root (veya SSH kullanıcı adın)
7. **Authentication:** Password veya Key

## Dump Dosyasını Import Et

### Adım 1: Dump Dosyasını Hazırla

Dump dosyasında şu satırları **SİL**:
- `DROP DATABASE alpdinamik_db;`
- `CREATE DATABASE alpdinamik_db ...`
- `ALTER DATABASE alpdinamik_db OWNER TO alpdinamik;`
- `\connect alpdinamik_db`

### Adım 2: DBeaver'da Import Et

1. DBeaver'da `alpdinamik_db` database'ine bağlan
2. **SQL Editor** aç (Ctrl+` veya sağ tık → SQL Editor)
3. **File → Open SQL Script** ile dump dosyasını aç
4. Yukarıdaki satırları sil
5. Tüm SQL'i seç (Ctrl+A)
6. Çalıştır (Ctrl+Alt+X veya Execute SQL)

### Alternatif: DBeaver Import Wizard

1. Database'e sağ tık → **Tools → Import Data**
2. **SQL Script** seç
3. Dump dosyasını seç
4. İleri → İleri → Finish

## Kontrol Et

```bash
# Sunucuda tablo sayısını kontrol et
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
"
```

## Hızlı Komut (Tek Satır)

```bash
cd /var/www/alpdinamik && docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'alpdinamik_db' AND pid <> pg_backend_pid();" 2>/dev/null || true && docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "DROP DATABASE IF EXISTS alpdinamik_db;" 2>/dev/null || true && docker exec alpdinamik-postgres psql -U alpdinamik_user -d postgres -c "CREATE DATABASE alpdinamik_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';"
```

