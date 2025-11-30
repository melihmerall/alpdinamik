# Docker Kurulum Kılavuzu

## 🐳 Hızlı Başlangıç

### 1. Development Ortamı (Sadece PostgreSQL Docker'da)

Sadece PostgreSQL'i Docker'da çalıştırıp, Next.js'i lokal olarak çalıştırmak için:

```bash
# PostgreSQL'i başlat
docker-compose -f docker-compose.dev.yml up -d

# .env dosyasını oluştur
cp .env.example .env

# Prisma migrate
npm run db:push

# Seed data
npm run db:seed

# Next.js'i lokal olarak çalıştır
npm run dev
```

### 2. Full Docker (PostgreSQL + Next.js)

Her şeyi Docker'da çalıştırmak için:

```bash
# .env dosyasını oluştur (opsiyonel, docker-compose.yml'deki varsayılanlar kullanılır)
cp .env.example .env

# Tüm servisleri build et ve başlat
docker-compose up -d --build

# Logları izle
docker-compose logs -f app

# Veritabanını migrate et (ilk seferinde)
docker-compose exec app npx prisma migrate deploy

# Seed data (ilk seferinde)
docker-compose exec app npm run db:seed
```

## 📋 Docker Komutları

### Servisleri Başlat/Durdur

```bash
# Başlat
docker-compose up -d

# Durdur
docker-compose down

# Durdur ve volume'ları sil (DİKKAT: Tüm veriler silinir!)
docker-compose down -v
```

### Logları İzle

```bash
# Tüm servisler
docker-compose logs -f

# Sadece app
docker-compose logs -f app

# Sadece postgres
docker-compose logs -f postgres
```

### Veritabanı İşlemleri

```bash
# Prisma migrate
docker-compose exec app npx prisma migrate deploy

# Prisma db push
docker-compose exec app npx prisma db push

# Seed data
docker-compose exec app npm run db:seed

# Prisma Studio (veritabanı görüntüleme)
docker-compose exec app npx prisma studio
```

### Container İçine Gir

```bash
# App container'ına gir
docker-compose exec app sh

# Postgres container'ına gir
docker-compose exec postgres psql -U alpdinamik -d alpdinamik_db
```

## 🔧 Sorun Giderme

### Port Zaten Kullanılıyor

Eğer 3000 veya 5432 portları kullanılıyorsa, `docker-compose.yml`'de portları değiştirin:

```yaml
ports:
  - "3001:3000"  # 3000 yerine 3001
  - "5433:5432"  # 5432 yerine 5433
```

### Veritabanı Bağlantı Hatası

1. PostgreSQL'in hazır olduğundan emin ol:
```bash
docker-compose ps
```

2. Health check'i kontrol et:
```bash
docker-compose logs postgres
```

3. Veritabanını yeniden oluştur:
```bash
docker-compose down -v
docker-compose up -d postgres
# Biraz bekle (10-15 saniye)
docker-compose up -d app
```

### Build Hatası

1. Cache'i temizle:
```bash
docker-compose build --no-cache
```

2. node_modules'i temizle:
```bash
rm -rf node_modules
npm install
```

## 🚀 Production Deployment

### Vercel'e Deploy

Vercel için sadece Next.js deploy edilir, PostgreSQL ayrı bir servis olmalı (Vercel Postgres, Supabase, Railway, vb.)

1. Vercel Postgres veya başka bir PostgreSQL servisi oluştur
2. Vercel'de environment variables ekle:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

3. Vercel'de build komutları:
   - Build Command: `npm run build`
   - Install Command: `npm ci && npx prisma generate`

### Docker ile Production

```bash
# Production build
docker-compose -f docker-compose.yml build

# Production'da çalıştır
docker-compose -f docker-compose.yml up -d
```

## 📝 Notlar

- Development'ta `docker-compose.dev.yml` kullan (sadece PostgreSQL)
- Production'da `docker-compose.yml` kullan (PostgreSQL + Next.js)
- `.env` dosyasını git'e commit etme (`.gitignore`'da olmalı)
- Production'da `NEXTAUTH_SECRET` mutlaka güçlü bir değer olmalı

