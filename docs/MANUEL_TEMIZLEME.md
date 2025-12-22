# Manuel Dump Temizleme ve Import

## Hızlı Çözüm

Sunucuda şu komutları sırayla çalıştırın:

```bash
cd /var/www/alpdinamik

# 1. Dump dosyasını temizle (tüm invalid byte'ları kaldır)
sed 's/\x00//g; s/\xFF//g; s/\x82//g; s/\x83//g; s/\x84//g; s/\x85//g; s/\x86//g; s/\x87//g; s/\x88//g; s/\x89//g; s/\x8A//g; s/\x8B//g; s/\x8C//g; s/\x8D//g; s/\x8E//g; s/\x8F//g' alpdinamik-dump-utf8.sql > dump-clean.sql

# 2. Database'i temizle
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << 'EOF'
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO alpdinamik_user;
GRANT ALL ON SCHEMA public TO public;
EOF

# 3. Temizlenmiş dosyayı import et (hataları görmezden gel)
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < dump-clean.sql 2>&1 | grep -v "ERROR.*invalid byte" | grep -v "ERROR.*encoding" | grep -v "ERROR.*role" | grep -v "NOTICE" || true

# 4. Kontrol et
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM representatives;"
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM products;"
```

## Alternatif: Script Kullan

```bash
cd /var/www/alpdinamik
chmod +x clean-and-import.sh
./clean-and-import.sh
```

## En İyi Çözüm: Yerel Database'i Yeniden Export Et

Yerel makinede dump'ı doğru encoding ile almak daha iyi:

```powershell
# Yerel makinede
docker exec alpdinamik-db-dev pg_dump -U alpdinamik -d alpdinamik_db --encoding=UTF8 --no-owner --no-acl --clean --if-exists > alpdinamik-dump-clean.sql

# Dosyayı kontrol et (ilk satırları)
Get-Content alpdinamik-dump-clean.sql -Head 5

# Sunucuya aktar
scp -P 23422 alpdinamik-dump-clean.sql root@178.157.14.211:/var/www/alpdinamik/
```

Sunucuda:

```bash
cd /var/www/alpdinamik

# Database temizle
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO alpdinamik_user;"

# Import et
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < alpdinamik-dump-clean.sql 2>&1 | grep -v "ERROR.*role" || true
```

