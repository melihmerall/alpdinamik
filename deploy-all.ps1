# Alpdinamik - Tam Deployment Script (PowerShell)
# Bu script tüm deployment işlemlerini yapar

$ErrorActionPreference = "Stop"

# Renkler
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Sunucu bilgileri
$SERVER_HOST = "178.157.14.211"
$SERVER_PORT = "23422"
$SERVER_USER = "root"
$SERVER_DIR = "/var/www/alpdinamik"
$DUMP_FILE = (Get-ChildItem -Filter "alpdinamik-dump-*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).Name

Write-ColorOutput "Cyan" "🚀 Alpdinamik - Tam Deployment Başlıyor..."
Write-ColorOutput "Yellow" "📍 Sunucu: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
Write-ColorOutput "Yellow" "📁 Hedef: $SERVER_DIR"
Write-Output ""

# 1. Dump dosyası kontrolü
if (-not $DUMP_FILE) {
    Write-ColorOutput "Red" "❌ Database dump dosyası bulunamadı!"
    Write-ColorOutput "Yellow" "💡 Önce database export yapın:"
    Write-Output "   docker exec alpdinamik-db-dev pg_dump -U alpdinamik -d alpdinamik_db > alpdinamik-dump-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"
    exit 1
}

Write-ColorOutput "Green" "✅ Dump dosyası bulundu: $DUMP_FILE"
Write-Output ""

# 2. Projeyi sunucuya aktar
Write-ColorOutput "Yellow" "📤 Proje dosyaları sunucuya aktarılıyor..."
Write-ColorOutput "Yellow" "⚠️  Şifre girmeniz gerekecek: 9JVEWtGp8QzNFrK"
Write-Output ""

# .gitignore'daki dosyaları hariç tutarak aktar
$excludePatterns = @(
    "node_modules",
    ".next",
    ".git",
    ".env.local",
    ".env.development.local",
    ".env.test.local",
    ".env.production.local",
    "dump.sql",
    "*.sql",
    "*.backup",
    "*.dump"
)

# SCP ile aktar
Write-ColorOutput "Cyan" "📦 Dosyalar aktarılıyor (bu biraz zaman alabilir)..."
scp -P $SERVER_PORT -r -o StrictHostKeyChecking=no `
    -o UserKnownHostsFile=$null `
    . "$SERVER_USER@${SERVER_HOST}:$SERVER_DIR/"

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Red" "❌ Dosya aktarımı başarısız!"
    exit 1
}

Write-ColorOutput "Green" "✅ Dosyalar aktarıldı"
Write-Output ""

# 3. Dump dosyasını aktar
Write-ColorOutput "Yellow" "📤 Database dump dosyası aktarılıyor..."
scp -P $SERVER_PORT -o StrictHostKeyChecking=no `
    -o UserKnownHostsFile=$null `
    $DUMP_FILE "$SERVER_USER@${SERVER_HOST}:$SERVER_DIR/"

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Red" "❌ Dump dosyası aktarımı başarısız!"
    exit 1
}

Write-ColorOutput "Green" "✅ Dump dosyası aktarıldı"
Write-Output ""

# 4. Sunucuda deployment komutlarını çalıştır
Write-ColorOutput "Yellow" "🔧 Sunucuda deployment işlemleri başlatılıyor..."
Write-Output ""

$deployCommands = @"
cd $SERVER_DIR

# .env.production oluştur (eğer yoksa)
if [ ! -f .env.production ]; then
    echo '⚠️  .env.production dosyası oluşturuluyor...'
    cat > .env.production << 'EOF'
SITE_NAME=alpdinamik
SITE_PORT=3001
DB_USER=alpdinamik_user
DB_PASSWORD=\$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
DB_NAME=alpdinamik_db
DB_PORT=5432
DATABASE_URL=postgresql://alpdinamik_user:\$DB_PASSWORD@alpdinamik-postgres:5432/alpdinamik_db?schema=public&connection_limit=20&pool_timeout=20
NEXTAUTH_SECRET=\$(openssl rand -base64 32)
NEXTAUTH_URL=http://178.157.14.211:3001
NEXT_PUBLIC_API_URL=http://178.157.14.211:3001
NODE_ENV=production
EOF
    echo '✅ .env.production oluşturuldu'
fi

# Database import
echo '📥 Database import ediliyor...'
chmod +x import-database.sh
./import-database.sh $DUMP_FILE

# Docker Compose ile çalıştır
echo '🐳 Docker Compose ile başlatılıyor...'
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

echo '✅ Deployment tamamlandı!'
echo '🌐 Site: http://178.157.14.211:3001'
"@

# Komutları geçici dosyaya yaz ve çalıştır
$tempScript = [System.IO.Path]::GetTempFileName() + ".sh"
$deployCommands | Out-File -FilePath $tempScript -Encoding UTF8

scp -P $SERVER_PORT -o StrictHostKeyChecking=no `
    -o UserKnownHostsFile=$null `
    $tempScript "$SERVER_USER@${SERVER_HOST}:/tmp/deploy.sh"

ssh -p $SERVER_PORT -o StrictHostKeyChecking=no `
    -o UserKnownHostsFile=$null `
    "$SERVER_USER@${SERVER_HOST}" "chmod +x /tmp/deploy.sh && bash /tmp/deploy.sh"

Remove-Item $tempScript -ErrorAction SilentlyContinue

Write-Output ""
Write-ColorOutput "Green" "✅ Deployment tamamlandı!"
Write-ColorOutput "Cyan" "🌐 Site erişim adresi: http://178.157.14.211:3001"
Write-Output ""
Write-ColorOutput "Yellow" "📝 Logları kontrol etmek için:"
Write-Output "   ssh -p $SERVER_PORT $SERVER_USER@${SERVER_HOST}"
Write-Output "   cd $SERVER_DIR"
Write-Output "   docker compose -f docker-compose.prod.yml logs -f"

