# Upload 500 Hatası Çözümü

## Sorun

Upload sırasında 500 hatası alınıyor. Muhtemel nedenler:
1. **İzin sorunu**: Container `nextjs` user (1001:1001) ile çalışıyor, volume mount edilen klasör root'a ait
2. **Klasör yok**: Upload klasörü container içinde oluşturulamıyor
3. **Path sorunu**: Volume mount çakışması

## Çözüm

### 1. İzinleri Düzelt

```bash
cd /var/www/alpdinamik
chmod +x fix-upload-permissions.sh
bash fix-upload-permissions.sh
```

Veya manuel:

```bash
# 1. Upload klasörlerini oluştur
mkdir -p /var/www/alpdinamik/uploads/{settings,products,banners,blog,company-pages,representatives}

# 2. İzinleri nextjs user'a ver (1001:1001)
chown -R 1001:1001 /var/www/alpdinamik/uploads
chmod -R 755 /var/www/alpdinamik/uploads

# 3. Container'ı yeniden başlat
docker-compose -f docker-compose.prod.yml --env-file .env.production down
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### 2. Container Loglarını Kontrol Et

```bash
# Upload hatası var mı?
docker logs alpdinamik-app --tail 50 | grep -i "upload\|error\|500"

# Veya tüm loglar
docker logs alpdinamik-app --tail 100
```

### 3. Container İçinde Test

```bash
# Container içinde uploads klasörü var mı?
docker exec alpdinamik-app ls -la /app/public/uploads

# Yazma izni var mı?
docker exec alpdinamik-app touch /app/public/uploads/test.txt && echo "✅ Yazma izni var" || echo "❌ Yazma izni yok"
docker exec alpdinamik-app rm -f /app/public/uploads/test.txt
```

## Alternatif Çözüm (Volume Mount Kaldır)

Eğer volume mount sorun çıkarıyorsa, kaldırabiliriz:

```yaml
# docker-compose.prod.yml'den volumes kısmını kaldır
# volumes:
#   - ./uploads:/app/public/uploads
```

Ama bu durumda:
- ✅ Dosyalar container içinde kalır
- ❌ Container yeniden build edilince kaybolur
- ❌ Kalıcı değil

## Önerilen Çözüm

Volume mount'u tutup izinleri düzeltmek (yukarıdaki fix-upload-permissions.sh scripti).

## Kontrol

1. İzinler doğru mu?
   ```bash
   ls -la /var/www/alpdinamik/uploads
   # nextjs user (1001:1001) sahibi olmalı
   ```

2. Container içinde yazma izni var mı?
   ```bash
   docker exec alpdinamik-app touch /app/public/uploads/test.txt
   ```

3. Admin panelden dosya yükle
4. Hata devam ederse logları kontrol et

