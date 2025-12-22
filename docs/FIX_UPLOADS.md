# Upload Dosyaları Sorunu Çözümü

## Sorun

Admin panelden yüklenen fotoğraflar görünmüyor çünkü:
- Dosyalar container içine kaydediliyor
- Container yeniden build edildiğinde dosyalar kayboluyor
- Volume mount edilmemiş

## Çözüm

### 1. docker-compose.prod.yml Güncellendi ✅

Upload klasörü için volume mount eklendi:
```yaml
volumes:
  - ./uploads:/app/public/uploads
```

### 2. Sunucuda Çalıştırılacak Komutlar

```bash
cd /var/www/alpdinamik

# Script'i çalıştır
chmod +x fix-uploads-volume.sh
bash fix-uploads-volume.sh
```

Veya manuel:

```bash
# 1. Upload klasörlerini oluştur
mkdir -p /var/www/alpdinamik/uploads/{settings,products,banners,blog,company-pages,representatives}

# 2. İzinleri ayarla
chmod -R 755 /var/www/alpdinamik/uploads

# 3. Mevcut container içindeki dosyaları kopyala (varsa)
docker cp alpdinamik-app:/app/public/uploads/. /var/www/alpdinamik/uploads/ 2>/dev/null || echo "Klasör boş"

# 4. Container'ı yeniden başlat
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Kontrol

```bash
# Upload klasörü var mı?
ls -la /var/www/alpdinamik/uploads

# Dosyalar var mı?
find /var/www/alpdinamik/uploads -type f

# Container içinde mount edilmiş mi?
docker exec alpdinamik-app ls -la /app/public/uploads
```

## Sonuç

Artık yüklenen dosyalar:
- ✅ Sunucuda `/var/www/alpdinamik/uploads` klasöründe kalıcı olarak saklanacak
- ✅ Container yeniden build edilse bile kaybolmayacak
- ✅ Browser'dan erişilebilir olacak (`/uploads/...`)

## Notlar

1. **İlk Yükleme**: Container içindeki mevcut dosyalar kopyalanacak (varsa)
2. **Yeni Dosyalar**: Artık direkt sunucuya kaydedilecek
3. **Erişim**: Dosyalar `/uploads/...` path'i ile erişilebilir olacak

