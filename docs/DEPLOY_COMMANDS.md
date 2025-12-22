# Canlıya Alma Komutları

## 1. Yerelde - Git Commit ve Push

```bash
# Değişiklikleri ekle
git add app/api/categories/all/
git add app/uploads/
git add components/pages/homes/home-2/banner-four.jsx
git add components/pages/homes/home-2/products-slider.jsx
git add app/layout.jsx
git add app/globals.css
git add app/api/upload/route.ts
git add docker-compose.prod.yml
git add Dockerfile

# Commit et
git commit -m "feat: Banner tam ekran, kategoriler slider'ı ve upload fix'leri"

# Push et
git push origin main
```

## 2. Sunucuda - Deploy

SSH ile sunucuya bağlan:
```bash
ssh root@178.157.14.211
```

Sunucuda şu komutları çalıştır:
```bash
cd /var/www/alpdinamik

# Git'ten son değişiklikleri çek
git pull origin main

# Docker container'ları durdur
docker-compose -f docker-compose.prod.yml --env-file .env.production down

# Eski image'ı sil (opsiyonel - temiz build için)
docker rmi alpdinamik_app:latest 2>/dev/null || true

# Yeni build ile başlat
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Logları kontrol et
docker logs alpdinamik-app -f
```

## 3. Kontrol

Tarayıcıda test et:
- http://178.157.14.211:3001 - Ana sayfa banner tam ekran mı?
- http://178.157.14.211:3001 - Kategoriler slider'ı çalışıyor mu?
- http://178.157.14.211:3001/admin - Admin panel çalışıyor mu?

