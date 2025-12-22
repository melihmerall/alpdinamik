#!/bin/bash

# Prisma Database Bağlantı Testi

echo "🔍 App Container'dan Database Bağlantı Testi..."
echo ""

docker exec alpdinamik-app node -e '
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
prisma.$connect()
  .then(() => {
    console.log("✅ Database bağlantısı başarılı!");
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error("❌ Database bağlantı hatası:", err.message);
    process.exit(1);
  });
'

echo ""
echo "✅ Test tamamlandı!"

