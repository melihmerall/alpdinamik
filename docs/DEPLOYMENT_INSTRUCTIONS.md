# 🚀 Alpdinamik Production Deployment - Multi-Site Yapı

## 📋 Genel Bilgiler

- **Sunucu IP:** [SERVER_IP]
- **SSH Port:** [SSH_PORT]
- **Site Port:** [SITE_PORT] (her site için farklı port)
- **Erişim:** http://[SERVER_IP]:[SITE_PORT]

## 🎯 Deployment Adımları

### 1️⃣ Local Database'i Export Et

**Windows PowerShell'de:**

```powershell
# Proje klasörüne git
cd C:\Users\Administrator\Desktop\AlpDinamik-Çalışması\alpdinamik

# Local database container'ını kontrol et
docker ps

# Database dump al (WSL veya Git Bash kullan)
# Git Bash'te:
bash export-local-db.sh

# Veya manuel:
docker exec alpdinamik-db-dev pg_dump -U alpdinamik -d alpdinamik_db > dump.sql
```

### 2️⃣ Sunucuya Bağlan ve Hazırlık Yap

**Windows'ta Git Bash veya WSL kullan:**

```bash
# SSH ile bağlan
ssh -p [SSH_PORT] root@[SERVER_IP]

# Şifre: [SSH_PASSWORD]
```

**Sunucuda:**

```bash
# Deployment script'ini çalıştır
cd /root
wget https://raw.githubusercontent.com/your-repo/deploy-multi-site.sh
# Veya manuel olarak script'i oluştur

chmod +x deploy-multi-site.sh
./deploy-multi-site.sh
```

### 3️⃣ Projeyi Sunucuya Aktar

**Windows'tan (Git Bash veya WSL):**

```bash
# Proje klasörüne git
cd C:\Users\Administrator\Desktop\AlpDinamik-Çalışması\alpdinamik

# Tüm projeyi sunucuya aktar (SCP)
scp -P [SSH_PORT] -r . root@[SERVER_IP]:/var/www/alpdinamik/

# Database dump'ı aktar
scp -P [SSH_PORT] dump.sql root@[SERVER_IP]:/var/www/alpdinamik/
```

**Alternatif: Git kullanarak:**

```bash
# Sunucuda
cd /var/www/alpdinamik
git clone [your-repo-url] .
```

### 4️⃣ Database'i Import Et

**Sunucuda:**

```bash
cd /var/www/alpdinamik

# Import script'ini çalıştır
chmod +x import-database.sh
./import-database.sh dump.sql

# Veya manuel:
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db < dump.sql
```

### 5️⃣ Environment Variables'ı Düzenle

**Sunucuda:**

```bash
cd /var/www/alpdinamik
nano .env.production
```

**Düzenle:**
- `SITE_PORT=3001` (doğru port)
- `NEXTAUTH_URL=http://[SERVER_IP]:[SITE_PORT]`
- `NEXT_PUBLIC_API_URL=http://[SERVER_IP]:[SITE_PORT]`
- Database şifreleri (script tarafından oluşturulmuş olacak)

### 6️⃣ Docker Build ve Deploy

**Sunucuda:**

```bash
cd /var/www/alpdinamik

# Build ve başlat
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Logları kontrol et
docker compose -f docker-compose.prod.yml logs -f

# Container durumunu kontrol et
docker ps
```

### 7️⃣ Migration Çalıştır

**Sunucuda:**

```bash
# Prisma migration
docker exec alpdinamik-app npx prisma migrate deploy

# Prisma client generate
docker exec alpdinamik-app npx prisma generate
```

### 8️⃣ Test Et

**Tarayıcıda:**
- http://[SERVER_IP]:[SITE_PORT]
- http://[SERVER_IP]:[SITE_PORT]/api/health

## 🔧 Multi-Site Yapısı

Her yeni site için:

1. Yeni port seç (3002, 3003, vb.)
2. Yeni klasör oluştur: `/var/www/site2`
3. `deploy-multi-site.sh` script'ini çalıştır (SITE_PORT değiştir)
4. Projeyi aktar
5. Deploy et

## 📊 Monitoring

```bash
# Logları izle
docker compose -f docker-compose.prod.yml logs -f app

# Container durumu
docker ps

# Database bağlantısı test
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT 1;"

# Health check
curl http://[SERVER_IP]:[SITE_PORT]/api/health
```

## 🔄 Güncelleme

```bash
cd /var/www/alpdinamik

# Yeni kodları çek
git pull

# Rebuild
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Migration (gerekirse)
docker exec alpdinamik-app npx prisma migrate deploy
```

## 🆘 Sorun Giderme

**Container başlamıyorsa:**
```bash
docker compose -f docker-compose.prod.yml logs
docker ps -a
```

**Database bağlantı hatası:**
```bash
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db
```

**Port kullanımda:**
```bash
netstat -tulpn | grep 3001
# Farklı port kullan
```

