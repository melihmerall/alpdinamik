# Login Yönlendirme ve CSS Sorunları Çözümü

## Sorun 1: Login Başarılı Ama Yönlendirme Olmuyor

### Neden:
- Cookie `secure: true` olarak set ediliyor ama HTTP kullanılıyor
- Cookie set edilmeden önce yönlendirme yapılıyor olabilir

### Çözüm:

#### 1. Login API Route Düzeltildi ✅
`app/api/auth/login/route.ts` dosyasında `secure` flag'i HTTP için `false` olacak şekilde güncellendi.

#### 2. Login Sayfası Düzeltildi ✅
`app/(auth)/admin/login/page.tsx` dosyasında yönlendirme için küçük bir delay eklendi.

#### 3. Test Et:
```bash
# Sunucuda container'ı yeniden başlat
cd /var/www/alpdinamik
docker-compose -f docker-compose.prod.yml restart app
```

## Sorun 2: CSS Sorunları - Componentler Sağa Sola Kaymış

### Neden:
- Database bağlantısı sorunlu olabilir
- CSS dosyaları yüklenmiyor olabilir
- Componentler database'den veri çekemiyor

### Çözüm:

#### 1. Database Bağlantısını Kontrol Et
```bash
# Sunucuda
docker exec alpdinamik-app env | grep DATABASE_URL
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM banners WHERE \"isActive\" = true;"
```

#### 2. CSS Dosyalarını Kontrol Et
```bash
# Sunucuda
docker exec alpdinamik-app ls -la /app/public/assets/css/
docker exec alpdinamik-app ls -la /app/public/assets/sass/
```

#### 3. Public Klasörünü Kontrol Et
```bash
# Sunucuda
docker exec alpdinamik-app find /app/public -name "*.css" | head -10
```

#### 4. Container Loglarını Kontrol Et
```bash
# Sunucuda
docker logs alpdinamik-app --tail 50 | grep -i "error\|css\|database"
```

#### 5. Browser Console'u Kontrol Et
F12 → Console → CSS veya API hataları var mı bak

## Hızlı Çözüm Komutları

### Tüm Sorunları Kontrol Et
```bash
# Sunucuda
cd /var/www/alpdinamik && \
echo "=== 1. Container Durumu ===" && \
docker-compose -f docker-compose.prod.yml ps && \
echo "=== 2. Database Bağlantısı ===" && \
docker exec alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) as banner_count FROM banners WHERE \"isActive\" = true;" && \
echo "=== 3. CSS Dosyaları ===" && \
docker exec alpdinamik-app ls -la /app/public/assets/css/ 2>/dev/null | head -5 && \
echo "=== 4. App Logları (Son 10) ===" && \
docker logs alpdinamik-app --tail 10
```

### Container'ı Yeniden Başlat
```bash
# Sunucuda
cd /var/www/alpdinamik
docker-compose -f docker-compose.prod.yml restart app
docker-compose -f docker-compose.prod.yml logs -f app
```

### Yeniden Build (Gerekirse)
```bash
# Sunucuda
cd /var/www/alpdinamik
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## Notlar

1. **Login Cookie**: HTTP kullanıldığı için `secure: false` olmalı. Bu düzeltildi.

2. **CSS Dosyaları**: `public/assets/css/` ve `public/assets/sass/` klasörlerinde olmalı.

3. **Database**: Componentler database'den veri çekiyor, database bağlantısı çalışıyor olmalı.

4. **Browser Cache**: CSS sorunları için browser cache'ini temizle (Ctrl+Shift+R).

## Test Adımları

1. **Login Test:**
   - http://178.157.14.211:3001/admin/login
   - admin@alpdinamik.com.tr / admin123 ile giriş yap
   - `/admin` sayfasına yönlendirilmeli

2. **CSS Test:**
   - Ana sayfayı aç: http://178.157.14.211:3001
   - F12 → Network → CSS dosyaları yükleniyor mu kontrol et
   - Componentler düzgün görünüyor mu kontrol et

3. **Database Test:**
   - Banner'lar görünüyor mu?
   - About section görünüyor mu?
   - Componentler sağa sola kaymış mı?

