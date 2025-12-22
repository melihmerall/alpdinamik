# Son Çözüm: Encoding Sorunu

## Problem
Dump dosyasında `0xFF` ve diğer binary karakterler var. Bu karakterler UTF-8 encoding'i bozuyor.

## Çözüm 1: Agresif Temizleme (Sunucuda)

```bash
cd /var/www/alpdinamik

# Script kullan
chmod +x aggressive-clean.sh
./aggressive-clean.sh
```

## Çözüm 2: Manuel Agresif Temizleme

```bash
cd /var/www/alpdinamik

# 1. Tüm binary karakterleri temizle
tr -cd '\11\12\15\40-\176\200-\377' < alpdinamik-dump-clean.sql > dump-ultra-clean.sql

# 2. Ek temizleme
sed 's/\xFF//g' dump-ultra-clean.sql > dump-final.sql

# 3. Database temizle
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << 'EOF'
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO alpdinamik_user;
EOF

# 4. Import et
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < dump-final.sql 2>&1 | grep -v "ERROR.*invalid byte" | grep -v "ERROR.*role" || true
```

## Çözüm 3: Yerel Database'den Binary Format ile Export (ÖNERİLEN)

Yerel makinede:

```powershell
# Binary format ile export et (encoding sorunları olmaz)
docker exec alpdinamik-db-dev pg_dump -U alpdinamik -d alpdinamik_db -Fc -f /tmp/dump.dump

# Container'dan çıkar
docker cp alpdinamik-db-dev:/tmp/dump.dump ./alpdinamik-dump.dump

# Sunucuya aktar
scp -P 23422 alpdinamik-dump.dump root@178.157.14.211:/var/www/alpdinamik/
```

Sunucuda:

```bash
cd /var/www/alpdinamik

# Dump'ı container'a kopyala
docker cp alpdinamik-dump.dump alpdinamik-postgres:/tmp/dump.dump

# Binary format ile restore et
docker exec -i alpdinamik-postgres pg_restore -U alpdinamik_user -d alpdinamik_db -c /tmp/dump.dump

# Temizlik
docker exec -i alpdinamik-postgres rm /tmp/dump.dump
```

## Çözüm 4: Yerel Database'den Plain Text (UTF-8 Zorlamalı)

Yerel makinede:

```powershell
# UTF-8 encoding zorlamalı export
docker exec alpdinamik-db-dev bash -c "export PGCLIENTENCODING=UTF8 && pg_dump -U alpdinamik -d alpdinamik_db --encoding=UTF8 --no-owner --no-acl" > alpdinamik-dump-utf8-final.sql

# Dosyayı kontrol et
Get-Content alpdinamik-dump-utf8-final.sql -Head 10

# Sunucuya aktar
scp -P 23422 alpdinamik-dump-utf8-final.sql root@178.157.14.211:/var/www/alpdinamik/
```

Sunucuda:

```bash
cd /var/www/alpdinamik

# Database temizle
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO alpdinamik_user;"

# Import et
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < alpdinamik-dump-utf8-final.sql 2>&1 | grep -v "ERROR.*role" || true
```

## En İyi Çözüm: Binary Format (pg_restore)

Binary format encoding sorunlarını tamamen önler. Önerilen yöntem budur.

