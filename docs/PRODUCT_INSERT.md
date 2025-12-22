# Product Verilerini Database'e Ekleme

## Yöntem 1: SQL Script ile (Önerilen)

### Sunucuda:

```bash
cd /var/www/alpdinamik

# SQL dosyasını çalıştır
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db < insert-products.sql
```

### Veya Script ile:

```bash
cd /var/www/alpdinamik
chmod +x insert-products.sh
./insert-products.sh
```

## Yöntem 2: DBeaver ile

1. DBeaver'da database'e bağlanın
2. `insert-products.sql` dosyasını açın
3. SQL'i seçin ve çalıştırın (F5 veya Execute)

## Yöntem 3: Manuel INSERT

DBeaver'da SQL Editor'de:

```sql
-- Product 1: YD110-MMC
INSERT INTO products (
    id, "representativeId", "variantId", slug, name, 
    description, body, "imageUrl", "order", "isActive", 
    "createdAt", "updatedAt"
) VALUES (
    'cmixctpz40007fua8uz7iw60v',
    'cmix3labo0000fspr4gwa7yrv',
    'cmixcquzv0003fua8nwyi0723',
    'yd110-mmc',
    'YD110-MMC',
    'açıklama',
    'açıklama',
    '/uploads/products/1765210611968-VKT-VH-S_683X600px-ezgif.com-jpg-to-webp-converter.webp',
    55,
    true,
    '2025-12-08 16:16:58.048',
    '2025-12-08 16:16:58.048'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    "updatedAt" = EXCLUDED."updatedAt";
```

## Kontrol

```sql
SELECT id, slug, name, "isActive", "order" 
FROM products 
WHERE id IN (
    'cmixctpz40007fua8uz7iw60v',
    'cmix69wg000034i2k04mgeq3j',
    'cmj1gxqy600012970810i1u04',
    'cmj1gzjm40005297052ee9101'
)
ORDER BY "order" DESC;
```

## Notlar

- `ON CONFLICT` kullanıldığı için aynı ID'ye sahip kayıt varsa güncellenir
- Boş değerler `NULL` olarak eklenir
- Tarih formatı: `YYYY-MM-DD HH:MM:SS.mmm`

