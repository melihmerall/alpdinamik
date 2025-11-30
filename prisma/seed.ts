import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default admin user
  const passwordHash = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@alpdinamik.com.tr' },
    update: {},
    create: {
      email: 'admin@alpdinamik.com.tr',
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  // Create content blocks
  const contentBlocks = [
    { key: 'home_hero_title', title: 'Ana Başlık', body: 'Lineer Hareket Sistemlerinde Mühendislik Ortağınız' },
    { key: 'home_hero_subtitle', title: 'Alt Başlık', body: 'Alp Dinamik olarak, lineer hareket çözümleri, proje tasarımı, ürün seçimi, CAD desteği ve devreye alma hizmetleriyle projelerinizin güvenli ve verimli çalışmasını sağlıyoruz.' },
    { key: 'home_hero_cta_primary', title: 'Birincil CTA', body: 'Projenizi Paylaşın' },
    { key: 'home_hero_cta_secondary', title: 'İkincil CTA', body: 'Ürün Portföyünü İnceleyin' },
    { key: 'footer_about', title: 'Footer Açıklama', body: 'Lineer hareket sistemlerinde doğru ürün ve mühendislik çözümleri sunuyoruz. Mecmot markasının Türkiye temsilciliği ile projelerinize değer katıyoruz.' },
  ]

  for (const block of contentBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: { title: block.title, body: block.body },
      create: block,
    })
  }

  // Create Mecmot representative
  const mecmot = await prisma.representative.upsert({
    where: { slug: 'mecmot' },
    update: {},
    create: {
      slug: 'mecmot',
      name: 'Mecmot',
      description: 'Mecmot markasının Türkiye temsilciliği',
      order: 1,
      isActive: true,
    },
  })

  // Create Mecmot products
  const mecmotProducts = [
    {
      slug: 'vidali-kriko',
      name: 'Vidalı Krikolar',
      description: 'Yüksek hassasiyet ve yük kapasitesi sunan vidalı kriko çözümleri',
      order: 1,
    },
    {
      slug: 'yon-degistirici',
      name: 'Yön Değiştiriciler',
      description: 'Güç aktarımında esneklik ve verimlilik sağlayan yön değiştirici ürünleri',
      order: 2,
    },
    {
      slug: 'lineer-aktuator',
      name: 'Lineer Aktuatörler',
      description: 'Otomatik ve hassas hareket kontrolü için ideal lineer aktüatör sistemleri',
      order: 3,
    },
  ]

  for (const product of mecmotProducts) {
    await prisma.product.upsert({
      where: {
        representativeId_slug: {
          representativeId: mecmot.id,
          slug: product.slug,
        },
      },
      update: {},
      create: {
        ...product,
        representativeId: mecmot.id,
        isActive: true,
      },
    })
  }

  // Create services
  const services = [
    {
      slug: 'proje-tasarimi-muhendislik',
      title: 'Proje Tasarımı & Mühendislik',
      summary: 'Uygulamanızın yük, strok, hız ve çalışma çevrimi gibi parametrelerini analiz ederek en doğru lineer hareket çözümünü tasarlıyoruz.',
      order: 1,
    },
    {
      slug: 'urun-secimi-boyutlandirma',
      title: 'Ürün Seçimi & Boyutlandırma',
      summary: 'Temsil ettiğimiz markaların geniş ürün yelpazesinden projenize en uygun vidalı kriko, yön değiştirici veya lineer aktüatörü seçiyor ve boyutlandırıyoruz.',
      order: 2,
    },
    {
      slug: '2d-3d-cad-teknik-veri',
      title: '2D / 3D CAD & Teknik Veri Desteği',
      summary: 'Mühendislik ekibimiz, projenizin tasarım süreçlerini hızlandırmak için gerekli 2D ve 3D CAD verilerini ve detaylı teknik dokümanları sağlar.',
      order: 3,
    },
    {
      slug: 'devreye-alma-satis-sonrasi',
      title: 'Devreye Alma & Satış Sonrası',
      summary: 'Sistemlerinizin sorunsuz bir şekilde devreye alınması ve uzun ömürlü çalışması için saha desteği ve kapsamlı satış sonrası hizmetler sunuyoruz.',
      order: 4,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }

  // Create sectors
  const sectors = [
    {
      slug: 'celik-endustrisi',
      name: 'Çelik Endüstrisi',
      description: 'Çelik üretim tesislerinde ağır yük kaldırma ve hassas konumlandırma için özel lineer hareket çözümleri',
      order: 1,
    },
    {
      slug: 'gunes-enerjisi-sistemleri',
      name: 'Güneş Enerjisi Sistemleri',
      description: 'Güneş paneli takip sistemleri ve yoğunlaştırılmış güneş enerjisi (CSP) uygulamaları için güvenilir aktüatör ve kriko çözümleri',
      order: 2,
    },
    {
      slug: 'savunma-sanayi',
      name: 'Savunma Sanayi',
      description: 'Savunma sanayi uygulamalarında hassas hareket ve konumlandırma çözümleri',
      order: 3,
    },
  ]

  for (const sector of sectors) {
    await prisma.sector.upsert({
      where: { slug: sector.slug },
      update: {},
      create: sector,
    })
  }

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

