# 🚀 Alpdinamik - Deployment Adımları

## ✅ Tamamlanan İşlemler
- ✅ Database export edildi: `alpdinamik-dump-20251216-120033.sql` (120KB)
- ✅ Sunucu hazır (Docker, Docker Compose kurulu)

## 📋 Manuel Deployment Adımları

### 1. Projeyi Sunucuya Aktar

**Windows PowerShell'de:**
```powershell
# Proje dosyalarını aktar (şifre: 9JVEWtGp8QzNFrK)
scp -P 23422 -r . root@178.157.14.211:/var/www/alpdinamik/
```

**VEYA Git Bash/WSL kullanarak:**
```bash
rsync -avz --progress -e "ssh -p 23422" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env.local' \
  --exclude '*.sql' \
  . root@178.157.14.211:/var/www/alpdinamik/
```

### 2. Database Dump'ını Aktar

```powershell
scp -P 23422 alpdinamik-dump-20251216-120033.sql root@178.157.14.211:/var/www/alpdinamik/
```

### 3. Sunucuya Bağlan ve Deployment Yap

```powershell
ssh -p 23422 root@178.157.14.211
```

**Sunucuda çalıştır:**

```bash
cd /var/www/alpdinamik

# .env.production oluştur
cat > .env.production << 'EOF'
SITE_NAME=alpdinamik
SITE_PORT=3001
DB_USER=alpdinamik_user
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
DB_NAME=alpdinamik_db
DB_PORT=5432
DATABASE_URL=postgresql://alpdinamik_user:$DB_PASSWORD@alpdinamik-postgres:5432/alpdinamik_db?schema=public&connection_limit=20&pool_timeout=20
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://178.157.14.211:3001
NEXT_PUBLIC_API_URL=http://178.157.14.211:3001
NODE_ENV=production
EOF

# Şifreleri kaydet (önemli!)
echo "DB_PASSWORD değerini kaydedin!" 
cat .env.production | grep DB_PASSWORD

# Database import
chmod +x import-database.sh
./import-database.sh alpdinamik-dump-20251216-120033.sql

# Docker Compose ile çalıştır
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Logları kontrol et
docker compose -f docker-compose.prod.yml logs -f
```

### 4. Site Erişimi

🌐 **Site URL:** http://178.157.14.211:3001

## 🔍 Kontrol Komutları

```bash
# Container durumu
docker ps

# Loglar
docker compose -f docker-compose.prod.yml logs -f app
docker compose -f docker-compose.prod.yml logs -f postgres

# Database bağlantısı test
docker exec -it alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db

# Container'ı yeniden başlat
docker compose -f docker-compose.prod.yml restart

# Container'ı durdur
docker compose -f docker-compose.prod.yml down
```

## ⚠️ Önemli Notlar

1. **Şifreler:** `.env.production` dosyasındaki `DB_PASSWORD` ve `NEXTAUTH_SECRET` değerlerini güvenli bir yerde saklayın!

2. **Port:** Site `3001` portunda çalışacak. Firewall'da açık olduğunu kontrol ettik.

3. **Database:** İlk kurulumda database boş olacak, import scripti çalıştırıldığında veriler yüklenecek.

4. **Build Süresi:** İlk build 5-10 dakika sürebilir.

