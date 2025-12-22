# PowerShell SSH Bağlantı ve Kurulum Script'i
# Bu script'i çalıştırdığında şifre girmen için zaman olacak

Write-Host "🔐 SSH Bağlantısı kuruluyor..." -ForegroundColor Yellow
Write-Host "⏳ Şifre girmen için 10 saniye bekleniyor..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host "📤 Script sunucuya aktarılıyor..." -ForegroundColor Yellow
$scpCommand = "scp -P 23422 setup-server.sh root@178.157.14.211:/root/"
Write-Host "Komut: $scpCommand" -ForegroundColor Gray
Write-Host "Şifre: 9JVEWtGp8QzNFrK" -ForegroundColor Red
Write-Host ""

# SCP ile script'i aktar
& cmd /c "scp -P 23422 setup-server.sh root@178.157.14.211:/root/"

Write-Host ""
Write-Host "✅ Script aktarıldı!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Şimdi SSH ile bağlanıp script'i çalıştır:" -ForegroundColor Yellow
Write-Host "   ssh -p 23422 root@178.157.14.211" -ForegroundColor Cyan
Write-Host "   chmod +x /root/setup-server.sh" -ForegroundColor Cyan
Write-Host "   /root/setup-server.sh" -ForegroundColor Cyan

