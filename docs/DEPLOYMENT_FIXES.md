# Production Sorunları ve Çözümleri

## 1. Database Import Sorunu

### Sorun
```
ERROR:  invalid byte sequence for encoding "UTF8": 0xff
```

### Çözüm

Sunucuda şu komutları çalıştırın:

```bash
cd /var/www/alpdinamik

# 1. Dump dosyasını UTF-8 formatına çevir (eğer gerekirse)
iconv -f ISO-8859-1 -t UTF-8 alpdinamik-dump-*.sql > dump-utf8.sql

# 2. Database'i temizle (dikkatli!)
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << EOF
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO alpdinamik_user;
GRANT ALL ON SCHEMA public TO public;
EOF

# 3. UTF-8 encoding ile import et
docker exec -i alpdinamik-postgres bash -c "export PGCLIENTENCODING=UTF8 && psql -U alpdinamik_user -d alpdinamik_db" < dump-utf8.sql

# VEYA otomatik script kullan:
chmod +x fix-database-import.sh
./fix-database-import.sh
```

## 2. CSS Dosyaları Sorunu

### Kontrol

Container içinde CSS dosyalarının varlığını kontrol edin:

```bash
# Container içinde public klasörünü kontrol et
docker exec alpdinamik-app ls -la /app/public/assets/css
docker exec alpdinamik-app ls -la /app/public/assets/sass

# Eğer dosyalar yoksa, container'ı yeniden build edin
docker compose -f docker-compose.prod.yml --env-file .env.production down
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### Çözüm

Eğer CSS dosyaları container içinde yoksa:

1. **Yerel makinede** `public` klasörünün tamamını sunucuya aktarın:
```bash
# WinSCP veya SCP ile
scp -P 23422 -r public root@178.157.14.211:/var/www/alpdinamik/
```

2. **Sunucuda** container'ı yeniden build edin:
```bash
cd /var/www/alpdinamik
docker compose -f docker-compose.prod.yml --env-file .env.production down
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

## 3. Hızlı Kontrol Scripti

Sunucuda şu scripti çalıştırarak tüm sorunları kontrol edin:

```bash
cd /var/www/alpdinamik
chmod +x check-production-issues.sh
./check-production-issues.sh
```

## 4. Tam Yeniden Deployment

Eğer sorunlar devam ederse:

```bash
cd /var/www/alpdinamik

# 1. Container'ları durdur
docker compose -f docker-compose.prod.yml --env-file .env.production down

# 2. Volume'ları temizle (dikkatli - tüm veriler silinir!)
docker volume rm alpdinamik_alpdinamik-postgres-data

# 3. Yeniden başlat
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# 4. Database'i import et
./fix-database-import.sh
```

