# Database Sorunu Çözümü

## Durum Özeti

✅ **Container'lar çalışıyor:**
- `alpdinamik-app` - Up 7 minutes (healthy)
- `alpdinamik-postgres` - Up 7 minutes (healthy)

✅ **Database durumu:**
- `alpdinamik_db` database'i mevcut
- Database hazır (pg_isready başarılı)
- `.env.production` dosyası var

## Sorun

Build sırasında database'e bağlanamıyor çünkü:
1. Build sırasında database container henüz çalışmıyor
2. Environment variables build sırasında yüklenmiyor olabilir

## Çözüm

### 1. Database İçeriğini Kontrol Et

```bash
cd /var/www/alpdinamik
bash check-database-tables.sh
```

### 2. Eğer Database Boşsa

Database boşsa, Prisma migration çalıştır:

```bash
# Prisma migration çalıştır
docker exec alpdinamik-app npx prisma migrate deploy

# Veya database dump'ını import et
# (daha önce oluşturduğun dump dosyasını kullan)
```

### 3. Build Sırasında Database Hatası (Normal)

Build sırasında gördüğün hatalar normaldir çünkü:
- Next.js build sırasında static generation yapmaya çalışıyor
- Database container henüz çalışmıyor
- Ama build başarıyla tamamlanmış (✓ Compiled successfully)

**Önemli:** Build başarılı, sadece bazı sayfalar database'e bağlanamadığı için static generation yapamadı. Bu normaldir.

### 4. Runtime'da Database Bağlantısı

Runtime'da (container çalışırken) database bağlantısı çalışmalı. Kontrol et:

```bash
# App container'dan database bağlantı testi
docker exec alpdinamik-app node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ Database bağlantısı başarılı!');
    return prisma.\$disconnect();
  })
  .catch((err) => {
    console.error('❌ Database bağlantı hatası:', err.message);
    process.exit(1);
  });
"
```

### 5. Site Çalışıyor mu?

```bash
# Site çalışıyor mu kontrol et
curl http://localhost:3001/api/health

# Veya browser'da aç
# http://178.157.14.211:3001
```

## Sonraki Adımlar

1. **Database içeriğini kontrol et** (check-database-tables.sh)
2. **Eğer database boşsa**, migration çalıştır veya dump import et
3. **Site çalışıyor mu kontrol et**
4. **Eğer hala sorun varsa**, app container loglarını kontrol et:
   ```bash
   docker logs alpdinamik-app --tail 50
   ```

## Notlar

- Build sırasındaki database hataları normaldir (build başarılı)
- Runtime'da database bağlantısı çalışmalı
- Eğer database boşsa, migration veya dump import et

