# 🔐 SSH Bağlantı ve Kurulum Talimatları

## Adım 1: Script'i Sunucuya Aktar

**Windows PowerShell'de:**

```powershell
scp -P 23422 setup-server.sh root@178.157.14.211:/root/
```

**Şifre:** `9JVEWtGp8QzNFrK`

⏳ Şifre girmen için yeterli zaman olacak, acele etme!

---

## Adım 2: SSH ile Bağlan

**Windows PowerShell'de:**

```powershell
ssh -p 23422 root@178.157.14.211
```

**Şifre:** `9JVEWtGp8QzNFrK`

⏳ Şifre girmen için yeterli zaman olacak!

---

## Adım 3: Sunucuda Script'i Çalıştır

SSH bağlantısı kurulduktan sonra, sunucuda şu komutları çalıştır:

```bash
# Script'i çalıştırılabilir yap
chmod +x /root/setup-server.sh

# Script'i çalıştır
/root/setup-server.sh
```

⏳ Script çalışırken beklemelisin, yaklaşık 2-3 dakika sürebilir.

---

## Adım 4: Sonuçları Kontrol Et

Script tamamlandıktan sonra şunları kontrol et:

```bash
# Docker versiyonu
docker --version

# Docker Compose versiyonu  
docker-compose --version

# Proje klasörü
ls -la /var/www/alpdinamik

# Firewall durumu
ufw status
```

---

## ✅ Başarılı Olursa

Şu mesajları göreceksin:
- ✅ Docker kuruldu
- ✅ Docker çalışıyor!
- ✅ Klasör oluşturuldu
- ✅ Firewall ayarlandı
- ✅ Sunucu hazırlığı tamamlandı!

---

## 🆘 Sorun Olursa

Hata mesajlarını kopyala ve paylaş, birlikte çözelim!

