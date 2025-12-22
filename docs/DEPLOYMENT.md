# 🚀 Production Deployment Guide

Bu dokümantasyon, Alpdinamik web sitesini VPS sunucuya Docker ile deploy etme sürecini açıklar.

## 📋 Gereksinimler

- Ubuntu 20.04+ VPS sunucu
- SSH erişimi
- Domain adı (SSL sertifikası için)
- Minimum 2GB RAM, 2 CPU core, 20GB disk alanı

## 🔧 Sunucu Hazırlığı

### 1. Sunucuya Bağlanma

```bash
ssh root@your-server-ip
# veya
ssh username@your-server-ip
```

### 2. Sistem Güncellemeleri

```bash
sudo apt update
sudo apt upgrade -y
```

### 3. Docker ve Docker Compose Kurulumu

```bash
# Docker kurulumu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose kurulumu
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Docker'ı başlat
sudo systemctl enable docker
sudo systemctl start docker

# Kullanıcıyı docker grubuna ekle (opsiyonel)
sudo usermod -aG docker $USER
```

### 4. Git Kurulumu (Opsiyonel)

```bash
sudo apt install git -y
```

## 📦 Proje Kurulumu

### 1. Projeyi Sunucuya Kopyalama

**Seçenek 1: Git ile**
```bash
cd /opt
sudo git clone https://github.com/your-repo/alpdinamik.git
cd alpdinamik
```

**Seçenek 2: SCP ile (local'den)**
```bash
# Local bilgisayarınızdan
scp -r ./alpdinamik root@your-server-ip:/opt/
ssh root@your-server-ip
cd /opt/alpdinamik
```

**Seçenek 3: Manuel Upload**
- Proje dosyalarını ZIP olarak sunucuya yükleyin
- Sunucuda unzip edin

### 2. Environment Variables Ayarlama

```bash
cd /opt/alpdinamik
cp .env.production.example .env.production
nano .env.production
```

Aşağıdaki değerleri doldurun:

```env
DB_USER=alpdinamik
DB_PASSWORD=güçlü_bir_şifre_buraya
DB_NAME=alpdinamik_db

NEXTAUTH_SECRET=32_karakterlik_rastgele_bir_string_buraya
NEXTAUTH_URL=https://yourdomain.com

DOMAIN=yourdomain.com
WWW_DOMAIN=www.yourdomain.com
```

**NEXTAUTH_SECRET oluşturma:**
```bash
openssl rand -base64 32
```

### 3. Gerekli Dizinleri Oluşturma

```bash
mkdir -p nginx/ssl
mkdir -p nginx/logs
mkdir -p nginx/conf.d
mkdir -p public/uploads
mkdir -p backups
chmod +x scripts/*.sh
```

## 🔒 SSL Sertifikası Kurulumu

### Let's Encrypt ile SSL (Önerilen)

```bash
# SSL sertifikası kurulumu
./scripts/setup-ssl.sh yourdomain.com your@email.com
```

Bu script:
- Certbot'u kurar
- SSL sertifikası oluşturur
- Sertifikaları `nginx/ssl/` dizinine kopyalar
- Otomatik yenileme ayarlar

### Manuel SSL Sertifikası

Eğer kendi SSL sertifikanız varsa:

```bash
# Sertifikaları nginx/ssl/ dizinine kopyalayın
cp your-fullchain.pem nginx/ssl/fullchain.pem
cp your-privkey.pem nginx/ssl/privkey.pem
chmod 644 nginx/ssl/fullchain.pem
chmod 600 nginx/ssl/privkey.pem
```

## 🌐 Nginx Konfigürasyonu

### 1. Domain Ayarları

`nginx/conf.d/default.conf` dosyasını düzenleyin:

```bash
nano nginx/conf.d/default.conf
```

`yourdomain.com` yerine kendi domain adınızı yazın.

### 2. Reverse Proxy (Opsiyonel)

Eğer farklı bir hosting'deki domaine reverse proxy yapmak istiyorsanız:

```bash
cp nginx/conf.d/reverse-proxy.conf.example nginx/conf.d/reverse-proxy.conf
nano nginx/conf.d/reverse-proxy.conf
```

Domain ve IP bilgilerini güncelleyin.

## 🚀 Deployment

### İlk Deployment

```bash
./scripts/deploy.sh
```

Bu script:
- Docker container'ları build eder
- Veritabanını başlatır
- Migration'ları çalıştırır
- Uygulamayı başlatır

### Deployment Sonrası Kontroller

```bash
# Container durumunu kontrol et
docker-compose -f docker-compose.prod.yml ps

# Logları kontrol et
docker-compose -f docker-compose.prod.yml logs -f app

# Veritabanı bağlantısını test et
docker-compose -f docker-compose.prod.yml exec app npx prisma db pull
```

## 🔄 Güncelleme İşlemi

```bash
# Son kodu çek (git kullanıyorsanız)
git pull origin main

# Yeniden deploy et
./scripts/deploy.sh
```

## 💾 Veritabanı Yedekleme

### Manuel Yedekleme

```bash
./scripts/backup-db.sh
```

Yedekler `backups/` dizininde saklanır.

### Otomatik Yedekleme (Cron)

```bash
# Crontab düzenle
crontab -e

# Her gün saat 02:00'de yedek al
0 2 * * * cd /opt/alpdinamik && ./scripts/backup-db.sh
```

## 🔙 Veritabanı Geri Yükleme

```bash
./scripts/restore-db.sh backups/alpdinamik_backup_20240101_120000.sql.gz
```

## 📊 Monitoring ve Loglar

### Logları Görüntüleme

```bash
# Tüm servislerin logları
docker-compose -f docker-compose.prod.yml logs -f

# Sadece app logları
docker-compose -f docker-compose.prod.yml logs -f app

# Sadece nginx logları
docker-compose -f docker-compose.prod.yml logs -f nginx

# Nginx access logları
tail -f nginx/logs/access.log

# Nginx error logları
tail -f nginx/logs/error.log
```

### Container Durumu

```bash
# Container durumları
docker-compose -f docker-compose.prod.yml ps

# Container kaynak kullanımı
docker stats
```

## 🔧 Troubleshooting

### Container Başlamıyor

```bash
# Logları kontrol et
docker-compose -f docker-compose.prod.yml logs app

# Container'ı yeniden başlat
docker-compose -f docker-compose.prod.yml restart app
```

### Veritabanı Bağlantı Hatası

```bash
# Veritabanı container'ının durumunu kontrol et
docker-compose -f docker-compose.prod.yml ps postgres

# Veritabanı loglarını kontrol et
docker-compose -f docker-compose.prod.yml logs postgres

# Veritabanına bağlanmayı test et
docker-compose -f docker-compose.prod.yml exec postgres psql -U alpdinamik -d alpdinamik_db
```

### SSL Sertifikası Sorunları

```bash
# Sertifikayı yenile
./scripts/renew-ssl.sh yourdomain.com

# Sertifika geçerliliğini kontrol et
openssl x509 -in nginx/ssl/fullchain.pem -text -noout
```

### Port Çakışması

Eğer 80 veya 443 portları kullanılıyorsa:

```bash
# Kullanan servisleri kontrol et
sudo lsof -i :80
sudo lsof -i :443

# Gerekirse diğer servisleri durdurun
sudo systemctl stop apache2  # veya nginx
```

## 🔐 Güvenlik Önerileri

1. **Firewall Kurulumu:**
```bash
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

2. **SSH Güvenliği:**
   - SSH key authentication kullanın
   - Root login'i devre dışı bırakın
   - SSH portunu değiştirin (opsiyonel)

3. **Düzenli Güncellemeler:**
```bash
# Sistem güncellemeleri
sudo apt update && sudo apt upgrade -y

# Docker image güncellemeleri
docker-compose -f docker-compose.prod.yml pull
```

4. **Yedekleme:**
   - Düzenli veritabanı yedekleri alın
   - Yedekleri farklı bir lokasyonda saklayın

## 📞 Destek

Sorun yaşarsanız:
1. Logları kontrol edin
2. Container durumlarını kontrol edin
3. Environment variables'ları kontrol edin
4. SSL sertifikalarını kontrol edin

## 🎯 Hızlı Komutlar

```bash
# Deployment
./scripts/deploy.sh

# Yedekleme
./scripts/backup-db.sh

# Logları görüntüle
docker-compose -f docker-compose.prod.yml logs -f

# Container'ları durdur
docker-compose -f docker-compose.prod.yml down

# Container'ları başlat
docker-compose -f docker-compose.prod.yml up -d

# Container'ları yeniden başlat
docker-compose -f docker-compose.prod.yml restart

# SSL yenile
./scripts/renew-ssl.sh yourdomain.com
```

---

**Not:** İlk deployment'tan sonra `docker-compose.prod.yml` dosyasındaki `command` satırını kaldırın veya yorum satırı yapın. Migration'lar sadece ilk kurulumda çalışmalıdır.

