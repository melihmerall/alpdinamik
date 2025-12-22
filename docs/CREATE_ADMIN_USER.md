# Yeni Admin Kullanıcısı Oluşturma

## Yöntem 1: SQL ile (DBeaver veya psql)

### Basit INSERT (Mevcut kullanıcıyı güncelle)

```sql
-- admin123 şifresi için bcrypt hash
-- Bu hash'i https://bcrypt-generator.com/ adresinden oluştur
-- Round: 12, Password: admin123

UPDATE users 
SET 
    "passwordHash" = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q6',
    "updatedAt" = NOW()
WHERE email = 'admin@alpdinamik.com.tr';
```

### Yeni Kullanıcı Oluştur (Eğer yoksa)

```sql
-- Unique ID oluştur (nanoid benzeri)
INSERT INTO users (
    id,
    email,
    "passwordHash",
    name,
    role,
    "createdAt",
    "updatedAt"
) VALUES (
    'admin-' || substr(md5(random()::text || clock_timestamp()::text), 1, 28),
    'admin@alpdinamik.com.tr',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q6', -- admin123
    'Admin',
    'ADMIN',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    "passwordHash" = EXCLUDED."passwordHash",
    "updatedAt" = NOW();
```

### Farklı Email ile Yeni Kullanıcı

```sql
INSERT INTO users (
    id,
    email,
    "passwordHash",
    name,
    role,
    "createdAt",
    "updatedAt"
) VALUES (
    'new-admin-' || substr(md5(random()::text || clock_timestamp()::text), 1, 28),
    'yeniadmin@alpdinamik.com.tr',  -- Farklı email
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q6', -- admin123
    'Yeni Admin',
    'ADMIN',
    NOW(),
    NOW()
);
```

## Yöntem 2: Bcrypt Hash Oluşturma

### Online Tool
1. https://bcrypt-generator.com/ adresine git
2. Round: `12` seç
3. Password: `admin123` yaz
4. Generate Hash'e tıkla
5. Oluşan hash'i kopyala

### Node.js ile (Yerel Makinede)

```bash
# Node.js REPL'de
node
> const bcrypt = require('bcryptjs');
> bcrypt.hashSync('admin123', 12);
'$2a$12$...' // Bu hash'i kullan
```

## Yöntem 3: Docker Container İçinde

```bash
# Sunucuda
docker exec alpdinamik-app node -e "
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('admin123', 12));
"
```

## Kontrol Et

```sql
-- Kullanıcıları listele
SELECT id, email, name, role, "createdAt" FROM users;

-- Belirli kullanıcıyı kontrol et
SELECT id, email, name, role FROM users WHERE email = 'admin@alpdinamik.com.tr';
```

## Önemli Notlar

1. **Bcrypt Hash**: Yukarıdaki hash örnektir. Gerçek hash'i bcrypt generator'dan almalısın.

2. **ID Format**: Mevcut kullanıcılar nanoid formatında ID kullanıyor (36 karakter). Yeni ID'ler için `md5(random()::text)` kullanabilirsin.

3. **Email Unique**: Email unique constraint var, aynı email ile iki kullanıcı oluşturamazsın.

4. **Şifre**: `admin123` şifresi için hash oluştururken round 12 kullan.

## Hızlı Komut (Sunucuda)

```bash
# Sunucuda - admin123 şifresi ile güncelle
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db << 'EOF'
UPDATE users 
SET 
    "passwordHash" = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q6',
    "updatedAt" = NOW()
WHERE email = 'admin@alpdinamik.com.tr';

SELECT id, email, name, role FROM users WHERE email = 'admin@alpdinamik.com.tr';
EOF
```

**Not**: Yukarıdaki hash örnektir. Gerçek hash'i https://bcrypt-generator.com/ adresinden oluşturmalısın!

