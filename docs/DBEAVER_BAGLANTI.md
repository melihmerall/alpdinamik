# DBeaver ile PostgreSQL Bağlantısı

## Yöntem 1: SSH Tunnel ile Bağlantı (ÖNERİLEN - Güvenli)

### Adım 1: DBeaver'da Yeni Bağlantı Oluştur

1. DBeaver'ı açın
2. Sol üstteki **"New Database Connection"** butonuna tıklayın (veya `Ctrl+Shift+N`)
3. **PostgreSQL** seçin ve **Next** butonuna tıklayın

### Adım 2: Ana Bağlantı Ayarları

**Main** sekmesi:
- **Host:** `localhost` (SSH tunnel kullanacağız)
- **Port:** `5432` (SSH tunnel üzerinden)
- **Database:** `alpdinamik_db`
- **Username:** `alpdinamik_user`
- **Password:** `.env.production` dosyasındaki `DB_PASSWORD`
- **Show all databases:** İşaretleyin (opsiyonel)

### Adım 3: SSH Tunnel Ayarları

**SSH** sekmesi:
- ✅ **Use SSH Tunnel** seçeneğini işaretleyin

**SSH Tunnel Settings:**
- **Host:** `178.157.14.211`
- **Port:** `23422`
- **User Name:** `root`
- **Authentication Method:** 
  - **Password** seçin
  - **Password:** `9JVEWtGp8QzNFrK`
  - ✅ **Save password** işaretleyin

**Local Port:** (otomatik olarak ayarlanır, genellikle boş bırakın)

### Adım 4: Test ve Kaydet

1. **Test Connection** butonuna tıklayın
2. İlk bağlantıda driver indirme isteği gelebilir, **Download** deyin
3. Bağlantı başarılı olursa **Finish** butonuna tıklayın
4. Bağlantı sol panelde görünecek

## Yöntem 2: Direkt Bağlantı (Port Açıksa)

Eğer PostgreSQL port'u dışarıya açıksa, direkt bağlanabilirsiniz.

### Adım 1: Port Kontrolü

Sunucuda kontrol edin:

```bash
# Port'un açık olup olmadığını kontrol et
docker ps | grep postgres
netstat -tlnp | grep 5432

# Firewall kontrolü
ufw status | grep 5432
```

### Adım 2: DBeaver'da Bağlantı

**Main** sekmesi:
- **Host:** `178.157.14.211`
- **Port:** `5432` (veya `.env.production`'daki `DB_PORT`)
- **Database:** `alpdinamik_db`
- **Username:** `alpdinamik_user`
- **Password:** `.env.production` dosyasındaki `DB_PASSWORD`

**SSH** sekmesi:
- ❌ **Use SSH Tunnel** seçeneğini KAPATIN

### Adım 3: Firewall Açmak (Gerekirse)

Sunucuda:

```bash
# PostgreSQL port'unu aç
ufw allow 5432/tcp

# Veya belirli IP'den erişim (daha güvenli)
ufw allow from YOUR_IP_ADDRESS to any port 5432
```

## Şifreyi Öğrenmek

Sunucuda:

```bash
cd /var/www/alpdinamik
grep DB_PASSWORD .env.production
```

## Bağlantı Testi

DBeaver'da:
1. Bağlantıya sağ tıklayın
2. **Edit Connection** seçin
3. **Test Connection** butonuna tıklayın
4. Başarılı olursa "Connected" mesajı görünür

## Sorun Giderme

### "Connection refused" hatası:
- SSH tunnel ayarlarını kontrol edin
- Sunucu IP ve port'unu kontrol edin
- Firewall ayarlarını kontrol edin

### "Authentication failed" hatası:
- Kullanıcı adı ve şifreyi kontrol edin
- `.env.production` dosyasındaki değerleri kontrol edin

### "Database does not exist" hatası:
- Database adını kontrol edin: `alpdinamik_db`
- Container içinde kontrol: `docker exec -i alpdinamik-postgres psql -U alpdinamik_user -l`

### SSH Tunnel çalışmıyor:
- SSH bağlantısını test edin: `ssh -p 23422 root@178.157.14.211`
- DBeaver'da SSH ayarlarını tekrar kontrol edin
- Local port'un başka bir uygulama tarafından kullanılmadığından emin olun

## Güvenlik Notları

⚠️ **ÖNEMLİ:**
1. **SSH Tunnel kullanın** (önerilen) - Port'u dışarıya açmaz
2. **Güçlü şifre kullanın**
3. **SSL/TLS bağlantısı kullanın** (production için)
4. **Sadece güvenilir IP'lerden erişime izin verin**

## Hızlı Bağlantı Özeti

### SSH Tunnel ile:
- **Host:** `localhost`
- **Port:** `5432`
- **SSH Host:** `178.157.14.211`
- **SSH Port:** `23422`
- **SSH User:** `root`
- **Database:** `alpdinamik_db`
- **User:** `alpdinamik_user`
- **Password:** `.env.production`'dan

### Direkt Bağlantı ile:
- **Host:** `178.157.14.211`
- **Port:** `5432`
- **Database:** `alpdinamik_db`
- **User:** `alpdinamik_user`
- **Password:** `.env.production`'dan

