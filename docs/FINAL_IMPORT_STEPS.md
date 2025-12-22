# Database Import Son Adımlar

## Mevcut Durum

Import işlemi kısmen başarılı:
- ✅ Tablolar oluşturuldu
- ✅ Veriler kopyalandı (COPY komutları başarılı)
- ⚠️ Role hataları (önemli değil - sadece owner bilgisi)
- ⚠️ Foreign key constraint hatası (düzeltilebilir)
- ⚠️ Tablo adı case sensitivity sorunu

## Hızlı Düzeltme

Sunucuda şu komutları çalıştırın:

```bash
cd /var/www/alpdinamik

# 1. Script'e izin ver
chmod +x fix-import-issues.sh

# 2. Sorunları düzelt
./fix-import-issues.sh
```

## Manuel Düzeltme

### 1. Tablo Adlarını Kontrol Et

```bash
# Tüm tabloları listele
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "\dt"

# Representatives tablosunu kontrol et (küçük harf)
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT COUNT(*) FROM representatives;"

# Veya büyük harf ile
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c 'SELECT COUNT(*) FROM "Representative";'
```

### 2. Foreign Key Sorunlarını Düzelt

```bash
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << 'EOF'
-- Eksik product referanslı image'ları sil
DELETE FROM product_images 
WHERE "productId" NOT IN (SELECT id FROM products);

-- Kontrol et
SELECT COUNT(*) FROM product_images;
SELECT COUNT(*) FROM products;
EOF
```

### 3. Database Özeti

```bash
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << 'EOF'
SELECT 
    'representatives' as table_name, 
    COUNT(*) as count 
FROM representatives
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'banners', COUNT(*) FROM banners
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'sectors', COUNT(*) FROM sectors
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials;
EOF
```

## Sonuç

Import işlemi başarılı görünüyor! Sadece:
1. Foreign key constraint hatası düzeltilmeli (eksik referanslar temizlenmeli)
2. Tablo adlarının case sensitivity'si kontrol edilmeli

Site çalışıyor olmalı. Tarayıcıda test edin: http://178.157.14.211:3001

