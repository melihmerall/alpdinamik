# Alp Dinamik - Docker Kurulum

## 🚀 Hızlı Başlangıç

### Seçenek 1: Sadece PostgreSQL Docker'da (Önerilen - Development)

```bash
# 1. PostgreSQL'i başlat
docker-compose -f docker-compose.dev.yml up -d

# 2. .env dosyasını oluştur
cp .env.example .env

# 3. Bağımlılıkları yükle
npm install

# 4. Prisma client generate
npm run db:generate

# 5. Veritabanını oluştur
npm run db:push

# 6. Seed data
npm run db:seed

# 7. Development server'ı başlat
npm run dev
```

Tarayıcıda: `http://localhost:3000`

### Seçenek 2: Her Şey Docker'da

```bash
# 1. .env dosyasını oluştur (opsiyonel)
cp .env.example .env

# 2. Build ve başlat
docker-compose up -d --build

# 3. Veritabanını migrate et (ilk seferinde)
docker-compose exec app npx prisma migrate deploy

# 4. Seed data (ilk seferinde)
docker-compose exec app npm run db:seed
```

Tarayıcıda: `http://localhost:3000`

## 📋 Temel Komutlar

```bash
# Servisleri başlat
docker-compose up -d

# Servisleri durdur
docker-compose down

# Logları izle
docker-compose logs -f app

# Container'a gir
docker-compose exec app sh
```

## 🔐 Admin Panel

- URL: `http://localhost:3000/admin/login`
- Email: `admin@alpdinamik.com.tr`
- Şifre: `admin123`

## 📚 Detaylı Dokümantasyon

Daha fazla bilgi için `DOCKER-SETUP.md` dosyasına bakın.

