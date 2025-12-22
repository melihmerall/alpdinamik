# Yerel Database'den Dump Alma ve Sunucuya Import Etme

## Adım 1: Yerel Database'i Kontrol Et

Yerel makinede (PowerShell veya CMD):

```bash
# Container'ın çalıştığını kontrol et
docker ps | findstr alpdinamik

# Eğer çalışmıyorsa başlat
docker compose up -d
```

## Adım 2: Yerel Database'den Dump Al

### Yöntem 1: Script ile (Önerilen)

```bash
# Script'e izin ver (Git Bash veya WSL kullanıyorsanız)
chmod +x re-export-database.sh

# Script'i çalıştır
./re-export-database.sh
```

### Yöntem 2: Manuel Komut

```bash
# Yerel container adını kontrol et
docker ps | findstr postgres

# Dump al (UTF-8 encoding ile)
docker exec alpdinamik-db-dev pg_dump -U alpdinamik -d alpdinamik_db --encoding=UTF8 --no-owner --no-acl > alpdinamik-dump-utf8-$(Get-Date -Format "yyyyMMdd-HHmmss").sql
```

**Not:** PowerShell'de tarih formatı farklı olabilir. Alternatif:

```bash
docker exec alpdinamik-db-dev pg_dump -U alpdinamik -d alpdinamik_db --encoding=UTF8 --no-owner --no-acl > alpdinamik-dump-utf8.sql
```

## Adım 3: Dump Dosyasını Kontrol Et

```bash
# Dosya boyutunu kontrol et (boş olmamalı)
dir alpdinamik-dump-utf8*.sql

# İlk birkaç satırı kontrol et
Get-Content alpdinamik-dump-utf8*.sql -Head 20
```

## Adım 4: Dump Dosyasını Sunucuya Aktar

### Yöntem 1: SCP ile (PowerShell)

```powershell
# Dump dosyasını bul
$dumpFile = Get-ChildItem alpdinamik-dump-utf8*.sql | Sort-Object LastWriteTime -Descending | Select-Object -First 1

# Sunucuya aktar
scp -P 23422 $dumpFile.Name root@178.157.14.211:/var/www/alpdinamik/
```

### Yöntem 2: WinSCP ile

1. WinSCP'yi aç
2. Bağlan: `sftp://root@178.157.14.211:23422`
3. Sol tarafta: Yerel dump dosyasını bul
4. Sağ tarafta: `/var/www/alpdinamik/` klasörüne sürükle-bırak

## Adım 5: Sunucuda Import Et

Sunucuda SSH ile bağlan:

```bash
ssh -p 23422 root@178.157.14.211
cd /var/www/alpdinamik
```

### Import İşlemi

```bash
# 1. Dump dosyasını kontrol et
ls -lh alpdinamik-dump-utf8*.sql

# 2. Database'i temizle (DİKKAT: Tüm veriler silinir!)
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << 'EOF'
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO alpdinamik_user;
GRANT ALL ON SCHEMA public TO public;
EOF

# 3. Yeni dump'ı import et
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < alpdinamik-dump-utf8*.sql 2>&1 | grep -v "ERROR.*role" | grep -v "ERROR.*invalid byte" || true

# 4. Kontrol et
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM representatives;"
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM products;"
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM banners;"
```

## Adım 6: Tüm Tabloları Kontrol Et

```bash
# Script ile kontrol
chmod +x check-all-tables.sh
./check-all-tables.sh

# VEYA manuel
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << 'EOF'
SELECT 
    'representatives' as table_name, COUNT(*) as count FROM representatives
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'banners', COUNT(*) FROM banners
UNION ALL SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL SELECT 'sectors', COUNT(*) FROM sectors
UNION ALL SELECT 'services', COUNT(*) FROM services
UNION ALL SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL SELECT 'testimonials', COUNT(*) FROM testimonials
ORDER BY count DESC;
EOF
```

## Hızlı Komut Özeti

### Yerel Makinede:
```bash
# 1. Dump al
docker exec alpdinamik-db-dev pg_dump -U alpdinamik -d alpdinamik_db --encoding=UTF8 --no-owner --no-acl > alpdinamik-dump-utf8.sql

# 2. Sunucuya aktar
scp -P 23422 alpdinamik-dump-utf8.sql root@178.157.14.211:/var/www/alpdinamik/
```

### Sunucuda:
```bash
# 1. Database temizle
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO alpdinamik_user;"

# 2. Import et
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < alpdinamik-dump-utf8.sql

# 3. Kontrol et
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM representatives;"
```

## Sorun Giderme

### Dump dosyası boşsa:
- Container'ın çalıştığından emin ol: `docker ps`
- Database adını kontrol et: `docker exec alpdinamik-db-dev psql -U alpdinamik -l`

### Import sırasında encoding hatası:
- Dump dosyasının UTF-8 olduğundan emin ol
- `--encoding=UTF8` parametresini kullan

### Import başarısızsa:
- Database container'ının çalıştığını kontrol et: `docker ps | grep postgres`
- Logları kontrol et: `docker logs alpdinamik-postgres`

