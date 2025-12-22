# 🚀 HEMEN BAŞLA - Sunucu Kurulumu

## ⚡ Hızlı Başlangıç (3 Adım)

### 1️⃣ Script'i Sunucuya Aktar

**Windows PowerShell'de şu komutu çalıştır:**

```powershell
scp -P 23422 setup-server.sh root@178.157.14.211:/root/
```

**Şifre:** `9JVEWtGp8QzNFrK`

⏳ **Şifre girmen için yeterli zaman var, acele etme!**

---

### 2️⃣ SSH ile Bağlan

**Windows PowerShell'de şu komutu çalıştır:**

```powershell
ssh -p 23422 root@178.157.14.211
```

**Şifre:** `9JVEWtGp8QzNFrK`

⏳ **Şifre girmen için yeterli zaman var!**

---

### 3️⃣ Sunucuda Script'i Çalıştır

SSH bağlantısı kurulduktan sonra, **sunucuda** şu komutları çalıştır:

```bash
chmod +x /root/setup-server.sh
/root/setup-server.sh
```

⏳ **Script çalışırken bekle, 2-3 dakika sürebilir!**

---

## ✅ Başarı Kontrolü

Script tamamlandıktan sonra şunları kontrol et:

```bash
docker --version
docker-compose --version
ls -la /var/www/alpdinamik
```

---

## 📝 Sonraki Adımlar

Script başarıyla tamamlandıktan sonra:
1. Projeyi sunucuya aktaracağız
2. Database'i import edeceğiz
3. Environment variables ayarlayacağız
4. Docker ile deploy edeceğiz

