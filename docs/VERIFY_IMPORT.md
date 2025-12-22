# Database Import Doğrulama

## Mevcut Durum

✅ Tablolar oluşturuldu (20 tablo)
⚠️ Çoğu tablo boş görünüyor

## Kontrol

Sunucuda şu komutu çalıştırın:

```bash
cd /var/www/alpdinamik
chmod +x check-all-tables.sh
./check-all-tables.sh
```

## Eğer Veriler Eksikse

### Yerel Database'i Yeniden Export Et

Yerel makinede:

```bash
# Yerel database'i UTF-8 ile export et
docker exec alpdinamik-db-dev pg_dump \
    -U alpdinamik \
    -d alpdinamik_db \
    --encoding=UTF8 \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    > alpdinamik-dump-utf8-$(date +%Y%m%d-%H%M%S).sql

# Sunucuya aktar
scp -P 23422 alpdinamik-dump-utf8-*.sql root@178.157.14.211:/var/www/alpdinamik/
```

### Sunucuda Yeniden Import Et

```bash
cd /var/www/alpdinamik

# Database'i temizle
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << 'EOF'
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO alpdinamik_user;
GRANT ALL ON SCHEMA public TO public;
EOF

# Yeni dump'ı import et
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < alpdinamik-dump-utf8-*.sql 2>&1 | grep -v "ERROR.*role" | grep -v "ERROR.*invalid byte" || true

# Kontrol et
./check-all-tables.sh
```

## Site Test

Tarayıcıda test edin:
- Ana sayfa: http://178.157.14.211:3001
- Admin panel: http://178.157.14.211:3001/admin/login

Eğer site çalışıyorsa ve sadece bazı veriler eksikse, bu normal olabilir (yerel database'de de eksik olabilir).

