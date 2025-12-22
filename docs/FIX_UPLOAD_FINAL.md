# Upload 500 Hatası - Final Çözüm

## Test Et

```bash
cd /var/www/alpdinamik
chmod +x test-upload-permissions.sh
bash test-upload-permissions.sh
```

## Muhtemel Sorunlar ve Çözümler

### 1. İzin Sorunu

Eğer yazma izni yoksa:

```bash
# İzinleri düzelt
chown -R 1001:1001 /var/www/alpdinamik/uploads
chmod -R 775 /var/www/alpdinamik/uploads

# Container'ı yeniden başlat
docker-compose -f docker-compose.prod.yml --env-file .env.production restart app
```

### 2. Volume Mount Sorunu

Eğer volume mount çalışmıyorsa, geçici olarak kaldırabiliriz:

```yaml
# docker-compose.prod.yml'den volumes kısmını kaldır
# volumes:
#   - ./uploads:/app/public/uploads
```

Ama bu durumda dosyalar kalıcı olmaz.

### 3. Klasör Oluşturma Sorunu

Upload API klasör oluşturmaya çalışıyor ama başarısız olabilir. Logları kontrol et:

```bash
docker logs alpdinamik-app --tail 100 | grep -A 5 -B 5 "upload\|mkdir\|writeFile"
```

### 4. Alternatif: Init Container

Eğer volume mount sorun çıkarıyorsa, init container ile klasörü oluşturup izinleri ayarlayabiliriz.

## Hızlı Test

```bash
# 1. Container içinde test
docker exec alpdinamik-app touch /app/public/uploads/test.txt
docker exec alpdinamik-app ls -la /app/public/uploads/test.txt
docker exec alpdinamik-app rm -f /app/public/uploads/test.txt

# 2. Klasör oluşturma testi
docker exec alpdinamik-app mkdir -p /app/public/uploads/test-folder
docker exec alpdinamik-app rmdir /app/public/uploads/test-folder
```

## En İyi Çözüm

1. Volume mount'u tut
2. İzinleri düzelt (1001:1001)
3. Container'ı yeniden başlat
4. Test et

