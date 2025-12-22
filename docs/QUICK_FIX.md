# Hızlı Database Import Çözümü

## Sunucuda Şu Komutları Çalıştırın:

```bash
cd /var/www/alpdinamik

# 1. Script'e izin ver
chmod +x simple-import.sh

# 2. Script'i çalıştır
./simple-import.sh
```

## Alternatif: Manuel Import (Daha Güvenli)

```bash
cd /var/www/alpdinamik

# 1. Dump dosyasını temizle
sed 's/\x00//g; s/\xFF//g; s/\x82//g' alpdinamik-dump-*.sql > dump-clean.sql

# 2. Database'i temizle (dikkatli!)
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << EOF
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO alpdinamik_user;
GRANT ALL ON SCHEMA public TO public;
EOF

# 3. Import et (hataları görmezden gel)
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < dump-clean.sql 2>&1 | grep -v "ERROR.*invalid byte" || true

# 4. Kontrol et
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM \"Representative\";"
```

## En İyi Çözüm: Yerel Database'i Yeniden Export Et

Yerel makinede:

```bash
# 1. Yerel database'i UTF-8 ile export et
docker exec alpdinamik-db-dev pg_dump -U alpdinamik -d alpdinamik_db --encoding=UTF8 --no-owner --no-acl > alpdinamik-dump-utf8.sql

# 2. Sunucuya aktar
scp -P 23422 alpdinamik-dump-utf8.sql root@178.157.14.211:/var/www/alpdinamik/
```

Sunucuda:

```bash
cd /var/www/alpdinamik

# Database'i temizle
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << EOF
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO alpdinamik_user;
EOF

# Import et
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < alpdinamik-dump-utf8.sql
```

