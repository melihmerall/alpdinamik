# Production Deployment Plan - Alpdinamik

## 🎯 Yapılacaklar Listesi

### 1. Sunucu Hazırlığı
- ✅ Ubuntu VPS sunucu hazır
- ⏳ Docker ve Docker Compose kurulumu
- ⏳ Git kurulumu
- ⏳ Firewall ayarları (port 80, 443, 22)

### 2. Proje Aktarımı
- ⏳ Projeyi sunucuya aktarma (Git clone veya SCP)
- ⏳ Environment variables dosyası oluşturma
- ⏳ Database connection string ayarlama

### 3. Database Kurulumu
- ⏳ PostgreSQL container'ı başlatma
- ⏳ Database migration çalıştırma
- ⏳ Mevcut veritabanı verilerini import etme (eğer varsa)

### 4. Application Build & Deploy
- ⏳ Docker image build
- ⏳ Container'ları başlatma
- ⏳ Health check test

### 5. Reverse Proxy (Nginx)
- ⏳ Nginx kurulumu
- ⏳ Domain yapılandırması
- ⏳ SSL sertifikası (Let's Encrypt)

### 6. Monitoring & Maintenance
- ⏳ Log takibi
- ⏳ Backup stratejisi
- ⏳ Auto-restart ayarları

## 📋 Gerekli Bilgiler

1. **SSH Bilgileri:**
   - IP Adresi: [Kullanıcıdan alınacak]
   - Port: [Genellikle 22]
   - Kullanıcı: [root veya sudo yetkili kullanıcı]
   - Şifre/Key: [Kullanıcıdan alınacak]

2. **Domain Bilgileri:**
   - Domain adı: [Kullanıcıdan alınacak]
   - DNS ayarları: [Kullanıcıdan alınacak]

3. **Database Bilgileri:**
   - Mevcut database var mı? [Kullanıcıdan alınacak]
   - Backup dosyası var mı? [Kullanıcıdan alınacak]

4. **Environment Variables:**
   - NEXTAUTH_SECRET: [Oluşturulacak]
   - NEXTAUTH_URL: [Domain'e göre]
   - DATABASE_URL: [Oluşturulacak]

## 🚀 Deployment Adımları

### Adım 1: Sunucu Bağlantısı ve Hazırlık
```bash
# SSH ile bağlan
ssh user@server_ip

# Sistem güncellemesi
sudo apt update && sudo apt upgrade -y

# Docker kurulumu
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Git kurulumu
sudo apt install -y git
```

### Adım 2: Proje Aktarımı
```bash
# Proje klasörü oluştur
mkdir -p /var/www/alpdinamik
cd /var/www/alpdinamik

# Projeyi clone et veya SCP ile aktar
# Git kullanıyorsak:
git clone [repository_url] .

# Veya SCP ile:
# scp -r ./alpdinamik user@server:/var/www/
```

### Adım 3: Environment Variables
```bash
# .env.production dosyası oluştur
nano .env.production

# Gerekli değişkenleri ekle:
# DATABASE_URL=postgresql://user:password@postgres:5432/dbname
# NEXTAUTH_SECRET=[generate secret]
# NEXTAUTH_URL=https://yourdomain.com
# NEXT_PUBLIC_API_URL=https://yourdomain.com
# DB_USER=alpdinamik
# DB_PASSWORD=[secure password]
# DB_NAME=alpdinamik_db
```

### Adım 4: Docker Build ve Deploy
```bash
# Docker Compose ile başlat
docker compose -f docker-compose.prod.yml up -d --build

# Logları kontrol et
docker compose -f docker-compose.prod.yml logs -f
```

### Adım 5: Database Migration
```bash
# Container içinde migration çalıştır
docker exec -it alpdinamik-app-prod npx prisma migrate deploy

# Veya seed çalıştır (eğer gerekirse)
docker exec -it alpdinamik-app-prod npm run db:seed
```

### Adım 6: Nginx Kurulumu
```bash
# Nginx kur
sudo apt install -y nginx

# Nginx config oluştur
sudo nano /etc/nginx/sites-available/alpdinamik

# SSL için Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🔒 Güvenlik

- Firewall ayarları (UFW)
- SSL sertifikası
- Database şifreleri güçlü olmalı
- Environment variables güvenli tutulmalı

## 📊 Monitoring

- Docker logs: `docker compose -f docker-compose.prod.yml logs -f`
- Container durumu: `docker ps`
- Health check: `curl http://localhost:3000/api/health`

