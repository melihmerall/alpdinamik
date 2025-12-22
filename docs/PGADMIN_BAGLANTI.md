# pgAdmin ile PostgreSQL Bağlantısı

## Adım 1: PostgreSQL Port'unu Dışarıya Aç

Sunucuda PostgreSQL port'unun dışarıya açık olması gerekiyor.

### Mevcut Durumu Kontrol Et

```bash
# Container'ın port mapping'ini kontrol et
docker ps | grep postgres

# Veya docker-compose ile
docker compose -f docker-compose.prod.yml ps
```

### Port'u Açmak İçin

`docker-compose.prod.yml` dosyasında PostgreSQL servisine port mapping ekleyin:

```yaml
postgres:
  # ... diğer ayarlar
  ports:
    - "5433:5432"  # Dış port:İç port (5432 zaten kullanılıyor olabilir, 5433 kullandık)
```

Sonra container'ı yeniden başlatın:

```bash
cd /var/www/alpdinamik
docker compose -f docker-compose.prod.yml --env-file .env.production down
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## Adım 2: PostgreSQL Ayarlarını Kontrol Et

Container içinde PostgreSQL'in dış bağlantıları kabul ettiğinden emin olun:

```bash
# Container'a bağlan
docker exec -it alpdinamik-postgres bash

# postgresql.conf'i kontrol et
cat /var/lib/postgresql/data/postgresql.conf | grep listen_addresses

# pg_hba.conf'i kontrol et
cat /var/lib/postgresql/data/pg_hba.conf | grep -v "^#"
```

Eğer `listen_addresses = '*'` değilse, düzeltin.

## Adım 3: Firewall Ayarları

Sunucuda PostgreSQL port'unu açın:

```bash
# Firewall'u kontrol et
ufw status

# PostgreSQL port'unu aç (5433 kullandıysanız)
ufw allow 5433/tcp

# Veya 5432 kullandıysanız
ufw allow 5432/tcp
```

## Adım 4: pgAdmin'de Bağlantı Kurma

### Bağlantı Bilgileri

- **Host/Server:** `178.157.14.211`
- **Port:** `5433` (veya docker-compose'da belirlediğiniz port)
- **Database:** `alpdinamik_db`
- **Username:** `alpdinamik_user`
- **Password:** `.env.production` dosyasındaki `DB_PASSWORD`

### pgAdmin'de Yeni Server Ekleme

1. pgAdmin'i açın
2. Sol panelde "Servers" üzerine sağ tıklayın
3. "Create" > "Server..." seçin
4. **General** sekmesi:
   - Name: `Alpdinamik Production`
5. **Connection** sekmesi:
   - Host name/address: `178.157.14.211`
   - Port: `5433` (veya belirlediğiniz port)
   - Maintenance database: `alpdinamik_db`
   - Username: `alpdinamik_user`
   - Password: `.env.production`'daki şifre
6. **Save password** seçeneğini işaretleyin
7. "Save" butonuna tıklayın

## Alternatif: SSH Tunnel ile Bağlantı (Daha Güvenli)

Port'u dışarıya açmak istemiyorsanız, SSH tunnel kullanabilirsiniz:

### Windows'ta (PuTTY veya PowerShell)

```powershell
# SSH tunnel oluştur
ssh -L 5433:localhost:5432 -p 23422 root@178.157.14.211 -N
```

### pgAdmin'de Bağlantı

- **Host/Server:** `localhost` (veya `127.0.0.1`)
- **Port:** `5433`
- **Database:** `alpdinamik_db`
- **Username:** `alpdinamik_user`
- **Password:** `.env.production`'daki şifre

## Hızlı Kontrol

Sunucuda şu komutla bağlantıyı test edin:

```bash
# Container içinden test
docker exec -i alpdinamik-postgres psql -U alpdinamik_user -d alpdinamik_db -c "SELECT version();"

# Dışarıdan test (eğer port açıksa)
psql -h 178.157.14.211 -p 5433 -U alpdinamik_user -d alpdinamik_db
```

## Güvenlik Notları

⚠️ **ÖNEMLİ:** PostgreSQL port'unu dışarıya açmak güvenlik riski oluşturur!

1. **SSH Tunnel kullanın** (önerilen) - Port'u dışarıya açmaz
2. **Sadece belirli IP'lerden erişime izin verin** (pg_hba.conf)
3. **Güçlü şifre kullanın**
4. **SSL/TLS bağlantısı kullanın** (production için)

## Sorun Giderme

### "Connection refused" hatası:
- Port mapping kontrol edin: `docker ps | grep postgres`
- Firewall kontrol edin: `ufw status`
- PostgreSQL'in dinlediğini kontrol edin: Container içinde `netstat -tlnp | grep 5432`

### "Authentication failed" hatası:
- Kullanıcı adı ve şifreyi kontrol edin: `.env.production` dosyası
- pg_hba.conf ayarlarını kontrol edin

### "Database does not exist" hatası:
- Database adını kontrol edin: `docker exec -i alpdinamik-postgres psql -U alpdinamik_user -l`

