# Admin Şifresi Düzeltme

## Sorun
"Geçersiz e-posta veya şifre" hatası alıyorsun. Bu, şifre hash'inin eşleşmediği anlamına geliyor.

## Çözüm: Doğru Hash Oluştur ve Güncelle

### Yöntem 1: Docker Container İçinde Hash Oluştur (Önerilen)

```bash
# Sunucuda
cd /var/www/alpdinamik

# admin123 şifresi için hash oluştur
docker exec alpdinamik-app node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 12));"
```

Çıktıyı kopyala ve aşağıdaki SQL'de kullan:

```sql
-- DBeaver'da veya SQL ile
UPDATE users 
SET 
    "passwordHash" = '<YUKARIDAKI_HASH_BURAYA>',
    "updatedAt" = NOW()
WHERE email = 'admin@alpdinamik.com.tr';
```

### Yöntem 2: Script ile (Otomatik)

```bash
# Sunucuda
cd /var/www/alpdinamik
chmod +x generate-password-hash.sh
./generate-password-hash.sh admin123
```

Script hash'i oluşturur ve SQL komutunu gösterir.

### Yöntem 3: Tek Komutla (Hızlı)

```bash
# Sunucuda - admin123 şifresi için hash oluştur ve güncelle
cd /var/www/alpdinamik && \
HASH=$(docker exec alpdinamik-app node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 12));") && \
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "UPDATE users SET \"passwordHash\" = '$HASH', \"updatedAt\" = NOW() WHERE email = 'admin@alpdinamik.com.tr';" && \
echo "✅ Şifre güncellendi!"
```

### Yöntem 4: DBeaver'da Manuel

1. **Hash Oluştur:**
   ```bash
   # Sunucuda
   docker exec alpdinamik-app node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 12));"
   ```

2. **DBeaver'da Güncelle:**
   ```sql
   UPDATE users 
   SET 
       "passwordHash" = '<OLUŞTURULAN_HASH>',
       "updatedAt" = NOW()
   WHERE email = 'admin@alpdinamik.com.tr';
   ```

3. **Kontrol Et:**
   ```sql
   SELECT id, email, name, role FROM users WHERE email = 'admin@alpdinamik.com.tr';
   ```

## Farklı Şifre İçin

```bash
# Örnek: "yenisifre123" için
docker exec alpdinamik-app node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('yenisifre123', 12));"
```

## Kontrol

```sql
-- Kullanıcıyı kontrol et
SELECT id, email, name, role, "createdAt" FROM users WHERE email = 'admin@alpdinamik.com.tr';

-- Hash'i gör (güvenlik için sadece test amaçlı)
SELECT email, LEFT("passwordHash", 20) as hash_preview FROM users WHERE email = 'admin@alpdinamik.com.tr';
```

## Notlar

1. **Bcrypt Round**: Kod `12` round kullanıyor, bu doğru.

2. **Hash Format**: `$2a$12$...` formatında olmalı.

3. **Container**: `alpdinamik-app` container'ı çalışıyor olmalı.

4. **Test**: Güncellemeden sonra login sayfasında test et.

## Hata Ayıklama

### Container çalışmıyorsa:
```bash
docker ps | grep alpdinamik-app
# Eğer yoksa:
docker-compose -f docker-compose.prod.yml up -d app
```

### Node modülü yoksa:
```bash
docker exec alpdinamik-app npm list bcryptjs
# Eğer yoksa container'ı rebuild et
```

