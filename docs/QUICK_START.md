# 🚀 Hızlı Başlangıç - Alpdinamik Deployment

## ⚡ Hızlı Adımlar

### 1. Local Database'i Export Et

**Windows PowerShell veya Git Bash:**

```bash
# Proje klasörüne git
cd C:\Users\Administrator\Desktop\AlpDinamik-Çalışması\alpdinamik

# Local database dump al
docker exec alpdinamik-db-dev pg_dump -U alpdinamik -d alpdinamik_db > dump.sql
```

### 2. Sunucuya Bağlan

**Git Bash veya WSL:**

```bash
ssh -p [SSH_PORT] root@[SERVER_IP]
# Şifre: [SSH_PASSWORD]
```

### 3. Sunucuda Hazırlık

```bash
# Sistem güncelle
apt update && apt upgrade -y

# Docker kur
apt install -y docker.io docker-compose-plugin git
systemctl enable docker
systemctl start docker

# Proje klasörü oluştur
mkdir -p /var/www/alpdinamik
cd /var/www/alpdinamik
```

### 4. Projeyi Aktar

**Windows'tan (Git Bash):**

```bash
# Tüm projeyi aktar
scp -P [SSH_PORT] -r . root@[SERVER_IP]:/var/www/alpdinamik/

# Dump'ı aktar
scp -P [SSH_PORT] dump.sql root@[SERVER_IP]:/var/www/alpdinamik/
```

### 5. Sunucuda Environment Ayarla

```bash
cd /var/www/alpdinamik

# .env.production oluştur
cat > .env.production << 'EOF'
SITE_NAME=alpdinamik
SITE_PORT=3001

DB_USER=alpdinamik_user
DB_PASSWORD=CHANGE_THIS_PASSWORD
DB_NAME=alpdinamik_db
DB_PORT=5432

DATABASE_URL=postgresql://alpdinamik_user:GüvenliŞifre123!@alpdinamik-postgres:5432/alpdinamik_db?schema=public&connection_limit=20&pool_timeout=20

NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://[SERVER_IP]:[SITE_PORT]
NEXT_PUBLIC_API_URL=http://[SERVER_IP]:[SITE_PORT]
NODE_ENV=production
APP_PORT=3000
EOF

# Secret'ı oluştur
NEXTAUTH_SECRET=$(openssl rand -base64 32)
sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$NEXTAUTH_SECRET|" .env.production
```

### 6. Database Import

```bash
# Önce container'ları başlat (database için)
docker compose -f docker-compose.prod.yml --env-file .env.production up -d postgres

# Database import
sleep 10  # Database'in başlamasını bekle
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db < dump.sql
```

### 7. Build ve Deploy

```bash
# Tüm servisleri başlat
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Logları izle
docker compose -f docker-compose.prod.yml logs -f
```

### 8. Migration

```bash
# Prisma migration
docker exec alpdinamik-app npx prisma migrate deploy
docker exec alpdinamik-app npx prisma generate
```

### 9. Test

Tarayıcıda aç: **http://[SERVER_IP]:[SITE_PORT]**

## ✅ Kontrol Komutları

```bash
# Container durumu
docker ps

# Loglar
docker compose -f docker-compose.prod.yml logs -f app

# Health check
curl http://[SERVER_IP]:[SITE_PORT]/api/health

# Database bağlantı
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT 1;"
```

## 🔄 Güncelleme

```bash
cd /var/www/alpdinamik
git pull  # veya yeni dosyaları aktar
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
docker exec alpdinamik-app npx prisma migrate deploy
```

## 🆘 Sorun Giderme

**Port kullanımda:**
```bash
netstat -tulpn | grep 3001
# .env.production'da SITE_PORT değiştir
```

**Container başlamıyor:**
```bash
docker compose -f docker-compose.prod.yml logs
docker ps -a
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

