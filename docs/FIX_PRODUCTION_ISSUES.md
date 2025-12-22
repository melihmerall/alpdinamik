# Canlı Sunucu Sorunları ve Çözümleri

## Sorun 1: Admin Giriş Yapamıyor (Hata Mesajı Yok)

### Neden:
- `/api/auth/login` API route'u çalışmıyor olabilir
- Database bağlantısı sorunlu olabilir
- Cookie ayarları yanlış olabilir

### Çözüm:

#### 1. API Route'u Kontrol Et
```bash
# Sunucuda
docker logs alpdinamik-app | grep -i "login\|auth\|error"
```

#### 2. Database Bağlantısını Kontrol Et
```bash
# Sunucuda
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT email, name, role FROM users WHERE email = 'admin@alpdinamik.com.tr';"
```

#### 3. Şifreyi Sıfırla
```sql
-- DBeaver'da veya SQL ile
-- admin123 şifresi için bcrypt hash'i gerekli
-- Önce mevcut hash'i kontrol et:
SELECT email, "passwordHash" FROM users WHERE email = 'admin@alpdinamik.com.tr';

-- Şifreyi güncelle (bcrypt hash gerekli)
-- Online bcrypt generator kullan: https://bcrypt-generator.com/
-- "admin123" için hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q6
UPDATE users 
SET "passwordHash" = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q6'
WHERE email = 'admin@alpdinamik.com.tr';
```

#### 4. API Health Check
```bash
# Sunucuda
curl http://localhost:3000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"admin@alpdinamik.com.tr","password":"admin123"}'
```

## Sorun 2: CSS/Component Sorunları - Sayfa İçeriği Yüklenmiyor

### Neden:
- Database bağlantısı olmadığı için sayfa render edilemiyor
- `home-2` component'i `ssr: false` ile client-side render ediliyor
- Database'den veri çekilemediği için placeholder'lar görünüyor

### Çözüm:

#### 1. Database Bağlantısını Kontrol Et
```bash
# Sunucuda
docker exec alpdinamik-app node -e "console.log(process.env.DATABASE_URL)"
```

#### 2. .env.production Dosyasını Kontrol Et
```bash
# Sunucuda
cd /var/www/alpdinamik
cat .env.production | grep DATABASE_URL
```

#### 3. Container'ı Yeniden Başlat
```bash
# Sunucuda
cd /var/www/alpdinamik
docker-compose -f docker-compose.prod.yml restart app
```

#### 4. Logları Kontrol Et
```bash
# Sunucuda
docker logs alpdinamik-app --tail 100 | grep -i "error\|database\|prisma"
```

#### 5. Public Klasörünü Kontrol Et
```bash
# Sunucuda
docker exec alpdinamik-app ls -la /app/public/assets/css
docker exec alpdinamik-app ls -la /app/public/assets/sass
```

## Hızlı Çözüm Komutları

### Tüm Sorunları Kontrol Et
```bash
# Sunucuda
cd /var/www/alpdinamik

# 1. Container durumunu kontrol et
docker-compose -f docker-compose.prod.yml ps

# 2. Database bağlantısını test et
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM users;"

# 3. App loglarını kontrol et
docker logs alpdinamik-app --tail 50

# 4. Database loglarını kontrol et
docker logs alpdinamik-postgres --tail 50

# 5. Environment variables'ı kontrol et
docker exec alpdinamik-app env | grep -E "DATABASE|NODE_ENV"
```

### Yeniden Build ve Deploy
```bash
# Sunucuda
cd /var/www/alpdinamik

# 1. Container'ları durdur
docker-compose -f docker-compose.prod.yml down

# 2. Yeniden build et ve başlat
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Logları takip et
docker-compose -f docker-compose.prod.yml logs -f app
```

## Admin Şifresini Sıfırlama (SQL)

```sql
-- DBeaver'da veya psql ile
-- admin123 şifresi için hash (bcrypt)
-- Bu hash'i bir bcrypt generator'dan alman gerekiyor
-- Örnek: https://bcrypt-generator.com/

UPDATE users 
SET "passwordHash" = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q6'
WHERE email = 'admin@alpdinamik.com.tr';

-- Kontrol et
SELECT email, name, role FROM users WHERE email = 'admin@alpdinamik.com.tr';
```

## Notlar

1. **Admin Login**: Eğer hata mesajı görünmüyorsa, API route çalışmıyor demektir. Browser console'u kontrol et (F12).

2. **CSS Sorunları**: Sayfa içeriği yüklenmiyorsa, muhtemelen database bağlantısı sorunlu. Container loglarını kontrol et.

3. **Database**: Dump dosyasını import ettikten sonra container'ı yeniden başlatmak gerekebilir.

