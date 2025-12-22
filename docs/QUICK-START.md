# 🚀 Hızlı Başlangıç - Alpdinamik

## Development Ortamı Kurulumu

### Adım 1: PostgreSQL'i Docker'da Başlat

```powershell
# PowerShell'de
docker-compose -f docker-compose.dev.yml up -d
```

veya npm script ile:

```powershell
npm run docker:dev
```

### Adım 2: .env Dosyası Oluştur

Proje kök dizininde `.env` dosyası oluştur:

```env
DATABASE_URL="postgresql://alpdinamik:alpdinamik123@localhost:5432/alpdinamik_db?schema=public"
NEXTAUTH_SECRET="change-me-in-production-please"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### Adım 3: Bağımlılıkları Yükle

```powershell
npm install
```

### Adım 4: Prisma Client Generate

```powershell
npm run db:generate
```

### Adım 5: Veritabanını Oluştur

```powershell
npm run db:push
```

### Adım 6: Seed Data (Başlangıç Verileri)

```powershell
npm run db:seed
```

### Adım 7: Development Server'ı Başlat

```powershell
npm run dev
```

## ✅ Kontrol

1. Tarayıcıda aç: `http://localhost:3000`
2. Admin panel: `http://localhost:3000/admin/login`
   - Email: `admin@alpdinamik.com.tr`
   - Şifre: `admin123`

## 🐳 Docker Komutları

```powershell
# PostgreSQL'i başlat
npm run docker:dev

# PostgreSQL'i durdur
npm run docker:dev:down

# Tüm servisleri başlat (PostgreSQL + Next.js)
npm run docker:up

# Tüm servisleri durdur
npm run docker:down

# Logları izle
npm run docker:logs
```

## 🔧 Sorun Giderme

### DATABASE_URL Hatası

`.env` dosyasının proje kök dizininde olduğundan ve içeriğinin doğru olduğundan emin ol.

### Port Zaten Kullanılıyor

Eğer 5432 portu kullanılıyorsa, `docker-compose.dev.yml`'de portu değiştir:

```yaml
ports:
  - "5433:5432"  # 5432 yerine 5433
```

Ve `.env` dosyasındaki `DATABASE_URL`'i güncelle.

### PostgreSQL Bağlantı Hatası

PostgreSQL'in hazır olmasını bekle (10-15 saniye):

```powershell
docker-compose -f docker-compose.dev.yml logs postgres
```

"database system is ready to accept connections" mesajını görünce devam et.

