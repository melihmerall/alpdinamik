# 🔄 Mevcut Verilerle Deployment Rehberi

Bu dokümantasyon, mevcut Docker container'ları ve verilerle yeni deployment yapma sürecini açıklar.

## 📋 Durum Kontrolü

### 1. Mevcut Container'ları Kontrol Etme

```bash
./scripts/check-existing-containers.sh
```

Bu script şunları kontrol eder:
- Çalışan container'lar
- Docker image'ları
- Volume'lar
- Port kullanımı
- AlpDinamik ile ilgili container'lar

### 2. Mevcut Veritabanı Yedeği Alma

Eğer mevcut bir veritabanı varsa, önce yedek alın:

```bash
# Eski container'dan yedek al
docker exec alpdinamik-db pg_dump -U alpdinamik alpdinamik_db > backup.sql

# Veya şifreli ise
docker exec alpdinamik-db PGPASSWORD=your_password pg_dump -U alpdinamik alpdinamik_db > backup.sql
```

## 🚀 Deployment Senaryoları

### Senaryo 1: Mevcut Container'ları Kullanma

Eğer mevcut container'lar çalışıyorsa ve sadece güncelleme yapmak istiyorsanız:

```bash
# 1. Mevcut container'ları durdur
docker-compose down  # veya mevcut docker-compose dosyanızla

# 2. Yeni dosyaları yükle
git pull  # veya dosyaları yükle

# 3. Yeni container'ları başlat
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Veritabanı migration'ları
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### Senaryo 2: Yeni Container'lara Geçiş (Verileri Koruma)

Eğer mevcut container'lardan yeni production container'larına geçmek istiyorsanız:

```bash
# 1. Mevcut verileri yedekle
./scripts/backup-db.sh  # veya manuel yedek

# 2. Yeni container'ları başlat
./scripts/deploy.sh

# 3. Yedeği yeni container'a yükle
./scripts/migrate-existing-data.sh
```

### Senaryo 3: Sıfırdan Kurulum (Verileri Taşıma)

Eğer tamamen yeni bir sunucuya taşınıyorsanız:

```bash
# 1. Eski sunucuda yedek al
./scripts/backup-db.sh

# 2. Yeni sunucuda kurulum yap
./scripts/setup-server.sh

# 3. Yedeği yeni sunucuya kopyala
scp backups/alpdinamik_backup_*.sql.gz user@new-server:/opt/alpdinamik/backups/

# 4. Yeni sunucuda deployment yap
./scripts/deploy.sh

# 5. Yedeği geri yükle
./scripts/restore-db.sh backups/alpdinamik_backup_*.sql.gz
```

## 🔧 Veri Koruma Stratejisi

### 1. Volume Kullanımı

`docker-compose.prod.yml` dosyasında PostgreSQL verileri volume'da saklanır:

```yaml
volumes:
  postgres-data-prod:
    driver: local
```

Bu sayede container silinse bile veriler korunur.

### 2. Yedekleme Stratejisi

**Otomatik Yedekleme:**
```bash
# Cron job ekle (her gün saat 02:00)
crontab -e
0 2 * * * cd /opt/alpdinamik && ./scripts/backup-db.sh
```

**Manuel Yedekleme:**
```bash
./scripts/backup-db.sh
```

### 3. Veri Taşıma

**Eski container'dan yeni container'a:**
```bash
# 1. Eski container'dan yedek al
docker exec old-container pg_dump -U user dbname > backup.sql

# 2. Yeni container'a yükle
docker exec -i new-container psql -U user dbname < backup.sql
```

## ⚠️ Önemli Notlar

### 1. Container İsimleri

Mevcut container'larınız farklı isimlerde olabilir. Kontrol edin:

```bash
docker ps -a | grep alpdinamik
```

### 2. Port Çakışmaları

Eğer portlar kullanılıyorsa:

```bash
# Port kullanımını kontrol et
sudo lsof -i :3000
sudo lsof -i :5432
sudo lsof -i :80
sudo lsof -i :443
```

### 3. Volume'lar

Mevcut volume'ları kontrol edin:

```bash
docker volume ls
```

Eğer mevcut volume'ları kullanmak istiyorsanız, `docker-compose.prod.yml` dosyasında volume isimlerini güncelleyin.

### 4. Environment Variables

Mevcut `.env` dosyanızı `.env.production` olarak kopyalayın:

```bash
cp .env .env.production
# veya
cp .env.production.template .env.production
# Değerleri doldurun
```

## 🔄 Migration Süreci

### 1. Prisma Migration'ları

Yeni migration'lar mevcut verileri etkilemez:

```bash
# Migration'ları uygula (veriler korunur)
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### 2. Schema Değişiklikleri

Eğer schema değişiklikleri varsa:

```bash
# Önce yedek al
./scripts/backup-db.sh

# Migration'ları uygula
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# Veya push kullan (development için)
docker-compose -f docker-compose.prod.yml exec app npx prisma db push
```

## 📊 Deployment Sonrası Kontroller

### 1. Container Durumları

```bash
docker-compose -f docker-compose.prod.yml ps
```

### 2. Loglar

```bash
# App logları
docker-compose -f docker-compose.prod.yml logs -f app

# Database logları
docker-compose -f docker-compose.prod.yml logs -f postgres

# Nginx logları
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### 3. Veritabanı Bağlantısı

```bash
# Veritabanına bağlan
docker-compose -f docker-compose.prod.yml exec postgres psql -U alpdinamik -d alpdinamik_db

# Tabloları listele
\dt

# Veri kontrolü
SELECT COUNT(*) FROM company_pages;
SELECT COUNT(*) FROM services;
```

## 🆘 Sorun Giderme

### Problem: Container başlamıyor

```bash
# Logları kontrol et
docker-compose -f docker-compose.prod.yml logs app

# Container'ı yeniden başlat
docker-compose -f docker-compose.prod.yml restart app
```

### Problem: Veritabanı bağlantı hatası

```bash
# Veritabanı container'ının durumunu kontrol et
docker-compose -f docker-compose.prod.yml ps postgres

# Veritabanı loglarını kontrol et
docker-compose -f docker-compose.prod.yml logs postgres
```

### Problem: Veriler kayboldu

```bash
# Yedeği geri yükle
./scripts/restore-db.sh backups/alpdinamik_backup_*.sql.gz
```

## ✅ Deployment Checklist

- [ ] Mevcut container'ları kontrol ettim
- [ ] Veritabanı yedeği aldım
- [ ] .env.production dosyasını hazırladım
- [ ] Port çakışmalarını kontrol ettim
- [ ] Volume'ları kontrol ettim
- [ ] Deployment script'ini çalıştırdım
- [ ] Verileri yeni container'a taşıdım
- [ ] Migration'ları uyguladım
- [ ] Container'ların çalıştığını doğruladım
- [ ] Logları kontrol ettim
- [ ] Veritabanı bağlantısını test ettim
- [ ] Siteyi test ettim

---

**Önemli:** Her zaman deployment öncesi yedek alın!

