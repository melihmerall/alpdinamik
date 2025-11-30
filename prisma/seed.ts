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
      summary: 'Uygulamanızın yük, strok, hız ve çalışma çevrimi gibi parametrelerini analiz ederek en doğru lineer hareket çözümünü tasarlıyoruz. Proje bazlı mühendislik danışmanlığı ile güvenli ve verimli sistemler kuruyoruz.',
      icon: 'flaticon-project',
      imageUrl: '/assets/img/service/services-1.jpg',
      order: 1,
    },
    {
      slug: 'urun-secimi-boyutlandirma',
      title: 'Ürün Seçimi & Boyutlandırma',
      summary: 'Temsil ettiğimiz markaların ürün portföyünden, uygulamanıza en uygun vidalı kriko, yön değiştirici veya lineer aktüatörü seçiyor ve teknik boyutlandırmasını yapıyoruz.',
      icon: 'flaticon-design-thinking',
      imageUrl: '/assets/img/service/services-2.jpg',
      order: 2,
    },
    {
      slug: '2d-3d-cad-teknik-veri',
      title: '2D / 3D CAD & Teknik Veri Desteği',
      summary: 'Projelerinizi hızlandırmak için 2D ve 3D CAD verileri, teknik çizimler ve ürün katalogları sağlıyoruz. Mekanik entegrasyon süreçlerinizi destekliyoruz.',
      icon: 'flaticon-data',
      imageUrl: '/assets/img/service/services-3.jpg',
      order: 3,
    },
    {
      slug: 'devreye-alma-satis-sonrasi',
      title: 'Devreye Alma & Satış Sonrası',
      summary: 'Sistemlerinizin saha kurulumu, devreye alma ve test süreçlerinde teknik destek sunuyoruz. Satış sonrası bakım ve yedek parça hizmetleriyle yanınızdayız.',
      icon: 'flaticon-wrench-1',
      imageUrl: '/assets/img/service/services-4.jpg',
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
    {
      slug: 'enerji',
      name: 'Enerji',
      description: 'Enerji sektörü uygulamaları',
      order: 4,
    },
    {
      slug: 'makina-imalat',
      name: 'Makina İmalat',
      description: 'Makina imalat sektörü uygulamaları',
      order: 5,
    },
    {
      slug: 'genel-makina',
      name: 'Genel Makina',
      description: 'Genel makina uygulamaları',
      order: 6,
    },
    {
      slug: 'genel',
      name: 'Genel Uygulama',
      description: 'Genel uygulamalar',
      order: 7,
    },
  ]

  const sectorMap = new Map<string, string>()
  for (const sector of sectors) {
    const created = await prisma.sector.upsert({
      where: { slug: sector.slug },
      update: {},
      create: sector,
    })
    sectorMap.set(sector.slug, created.id)
  }

  // Create blog posts
  const blogPosts = [
    {
      slug: 'lineer-hareket-sistemlerinde-dogru-urun-secimi',
      title: 'Lineer Hareket Sistemlerinde Doğru Ürün Seçimi',
      summary: 'Vidalı kriko, yön değiştirici ve lineer aktüatör seçiminde dikkat edilmesi gereken kritik parametreler: yük kapasitesi, strok mesafesi, hız gereksinimleri ve çalışma çevrimi. Uygulamanıza en uygun ürünü seçmek için mühendislik analizi neden önemlidir?',
      body: 'Vidalı kriko, yön değiştirici ve lineer aktüatör seçiminde dikkat edilmesi gereken kritik parametreler: yük kapasitesi, strok mesafesi, hız gereksinimleri ve çalışma çevrimi. Uygulamanıza en uygun ürünü seçmek için mühendislik analizi neden önemlidir?',
      publishedAt: new Date('2025-01-10'),
      isPublished: true,
    },
    {
      slug: 'projelerde-duty-cycle-neden-kritik',
      title: 'Projelerde Duty Cycle Neden Kritik?',
      summary: 'Duty cycle, lineer hareket sistemlerinin performansını ve ömrünü belirleyen en önemli faktörlerden biridir. Çalışma çevrimi analizi yapılmadan seçilen ürünlerde erken arıza ve performans kayıpları yaşanabilir. Doğru duty cycle hesaplaması nasıl yapılır?',
      body: 'Duty cycle, lineer hareket sistemlerinin performansını ve ömrünü belirleyen en önemli faktörlerden biridir. Çalışma çevrimi analizi yapılmadan seçilen ürünlerde erken arıza ve performans kayıpları yaşanabilir. Doğru duty cycle hesaplaması nasıl yapılır?',
      publishedAt: new Date('2025-01-12'),
      isPublished: true,
    },
    {
      slug: 'cad-verileriyle-calisma-sureclerini-hizlandirmak',
      title: '2D/3D CAD Verileriyle Çalışma Süreçlerini Hızlandırmak',
      summary: 'Mekanik entegrasyon süreçlerinde 2D ve 3D CAD verilerinin kullanımı, proje sürelerini önemli ölçüde kısaltır. Teknik çizimler ve ürün kataloglarıyla çalışmanın avantajları ve CAD desteğinin proje başarısına etkisi.',
      body: 'Mekanik entegrasyon süreçlerinde 2D ve 3D CAD verilerinin kullanımı, proje sürelerini önemli ölçüde kısaltır. Teknik çizimler ve ürün kataloglarıyla çalışmanın avantajları ve CAD desteğinin proje başarısına etkisi.',
      publishedAt: new Date('2025-01-13'),
      isPublished: true,
    },
    {
      slug: 'celik-endustrisinde-lineer-hareket-uygulamalari',
      title: 'Çelik Endüstrisinde Lineer Hareket Uygulamaları',
      summary: 'Çelik levha taşıma, konumlandırma ve seviye ayarlama sistemlerinde vidalı kriko ve yön değiştirici kullanımı. Endüstriyel pres hatlarında lineer hareket çözümlerinin kritik rolü ve uygulama örnekleri.',
      body: 'Çelik levha taşıma, konumlandırma ve seviye ayarlama sistemlerinde vidalı kriko ve yön değiştirici kullanımı. Endüstriyel pres hatlarında lineer hareket çözümlerinin kritik rolü ve uygulama örnekleri.',
      publishedAt: new Date('2025-01-15'),
      isPublished: true,
    },
    {
      slug: 'gunes-enerjisi-sistemlerinde-vidali-kriko-kullanimi',
      title: 'Güneş Enerjisi Sistemlerinde Vidalı Kriko Kullanımı',
      summary: 'Güneş takip mekanizmalarında vidalı krikoların rolü ve seçim kriterleri. Yüksek hassasiyet ve dayanıklılık gerektiren bu uygulamalarda doğru ürün seçimi ve mühendislik desteğinin önemi.',
      body: 'Güneş takip mekanizmalarında vidalı krikoların rolü ve seçim kriterleri. Yüksek hassasiyet ve dayanıklılık gerektiren bu uygulamalarda doğru ürün seçimi ve mühendislik desteğinin önemi.',
      publishedAt: new Date('2025-01-17'),
      isPublished: true,
    },
    {
      slug: 'devreye-alma-ve-satis-sonrasi-hizmetlerin-onemi',
      title: 'Devreye Alma ve Satış Sonrası Hizmetlerin Önemi',
      summary: 'Lineer hareket sistemlerinin saha kurulumu, devreye alma ve test süreçlerinde teknik desteğin kritik rolü. Satış sonrası bakım, yedek parça ve sürekli destek hizmetlerinin sistem performansına etkisi.',
      body: 'Lineer hareket sistemlerinin saha kurulumu, devreye alma ve test süreçlerinde teknik desteğin kritik rolü. Satış sonrası bakım, yedek parça ve sürekli destek hizmetlerinin sistem performansına etkisi.',
      publishedAt: new Date('2025-01-21'),
      isPublished: true,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  // Create reference projects
  const referenceProjects = [
    {
      slug: 'endustriyel-pres-hatti',
      title: 'Endüstriyel Pres Hattı Seviye Ayarlama Sistemi',
      summary: 'Çelik Endüstrisi',
      imageUrl: '/assets/img/portfolio/portfolio-1.jpg',
      sectorId: sectorMap.get('celik-endustrisi'),
    },
    {
      slug: 'gunes-takip-mekanizmasi',
      title: 'Güneş Takip Mekanizması Vidalı Kriko Uygulaması',
      summary: 'Güneş Enerjisi',
      imageUrl: '/assets/img/portfolio/portfolio-2.jpg',
      sectorId: sectorMap.get('gunes-enerjisi-sistemleri'),
    },
    {
      slug: 'hareketli-platform-sistemi',
      title: 'Hareketli Platform Lineer Aktüatör Sistemi',
      summary: 'Savunma Sanayi',
      imageUrl: '/assets/img/portfolio/portfolio-3.jpg',
      sectorId: sectorMap.get('savunma-sanayi'),
    },
    {
      slug: 'hidroelektrik-kapak-sistemi',
      title: 'Hidroelektrik Kapak Seviye Kontrol Sistemi',
      summary: 'Enerji',
      imageUrl: '/assets/img/portfolio/portfolio-4.jpg',
      sectorId: sectorMap.get('enerji'),
    },
    {
      slug: 'makina-seviye-ayarlama',
      title: 'Makina İmalat Seviye Ayarlama Sistemi',
      summary: 'Makina İmalat',
      imageUrl: '/assets/img/portfolio/portfolio-5.jpg',
      sectorId: sectorMap.get('makina-imalat'),
    },
    {
      slug: 'celik-levha-tasima',
      title: 'Çelik Levha Taşıma ve Konumlandırma Sistemi',
      summary: 'Çelik Endüstrisi',
      imageUrl: '/assets/img/portfolio/portfolio-6.jpg',
      sectorId: sectorMap.get('celik-endustrisi'),
    },
    {
      slug: 'otomasyon-hatti',
      title: 'Otomasyon Hattı Yön Değiştirici Uygulaması',
      summary: 'Genel Makina',
      imageUrl: '/assets/img/portfolio/portfolio-7.jpg',
      sectorId: sectorMap.get('genel-makina'),
    },
    {
      slug: 'endustriyel-kaldirma',
      title: 'Endüstriyel Kaldırma ve Konumlandırma Sistemi',
      summary: 'Genel Uygulama',
      imageUrl: '/assets/img/portfolio/portfolio-8.jpg',
      sectorId: sectorMap.get('genel'),
    },
  ]

  for (const project of referenceProjects) {
    await prisma.referenceProject.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    })
  }

  // Create team members
  const teamMembers = [
    {
      slug: 'amelia-clover',
      name: 'Amelia Clover',
      role: 'Project Manager',
      category: 'founder',
      imageUrl: '/assets/img/team/team-1.jpg',
      socialLinks: {
        facebook: 'https://www.facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://www.linkedin.com',
      },
      order: 1,
    },
    {
      slug: 'julian-wyat',
      name: 'Julian Wyat',
      role: 'Site Engineer',
      category: 'writer',
      imageUrl: '/assets/img/team/team-2.jpg',
      socialLinks: {
        facebook: 'https://www.facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://www.linkedin.com',
      },
      order: 2,
    },
    {
      slug: 'guy-hawkins',
      name: 'Guy Hawkins',
      role: 'Safety Officer',
      category: 'founder',
      imageUrl: '/assets/img/team/team-3.jpg',
      socialLinks: {
        facebook: 'https://www.facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://www.linkedin.com',
      },
      order: 3,
    },
    {
      slug: 'archer-graham',
      name: 'Archer Graham',
      role: 'General Laborer',
      category: 'writer',
      imageUrl: '/assets/img/team/team-4.jpg',
      socialLinks: {
        facebook: 'https://www.facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://www.linkedin.com',
      },
      order: 4,
    },
    {
      slug: 'alan-dosan',
      name: 'Alan Dosan',
      role: 'Lead Architect',
      category: 'manager',
      imageUrl: '/assets/img/team/member-1.jpg',
      socialLinks: {
        facebook: 'https://www.facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://www.linkedin.com',
      },
      order: 5,
    },
    {
      slug: 'sarah-johnson',
      name: 'Sarah Johnson',
      role: 'General Laborer',
      category: 'designer',
      imageUrl: '/assets/img/team/member-2.jpg',
      socialLinks: {
        facebook: 'https://www.facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://www.linkedin.com',
      },
      order: 6,
    },
    {
      slug: 'derya-kurtulus',
      name: 'Derya Kurtulus',
      role: 'Safety Inspector',
      category: 'inspector',
      imageUrl: '/assets/img/team/member-3.jpg',
      socialLinks: {
        facebook: 'https://www.facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://www.linkedin.com',
      },
      order: 7,
    },
    {
      slug: 'steve-rhodes',
      name: 'Steve Rhodes',
      role: 'Civil Engineer',
      category: 'engineer',
      imageUrl: '/assets/img/team/member-4.jpg',
      socialLinks: {
        facebook: 'https://www.facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://www.linkedin.com',
      },
      order: 8,
    },
  ]

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: {},
      create: {
        ...member,
        socialLinks: member.socialLinks,
        isActive: true,
      },
    })
  }

  // Create testimonials
  const testimonials = [
    {
      name: 'Mehmet Yılmaz',
      role: 'Makine İmalat Müdürü',
      message: 'Alp Dinamik ile çalışmak, projelerimizde doğru ürün seçimi ve mühendislik desteği açısından büyük fark yarattı. CAD verileri ve teknik destekleri sayesinde entegrasyon süreçlerimiz çok hızlandı.',
      imageUrl: '/assets/img/team/team-1.jpg',
      rating: 5,
      order: 1,
    },
    {
      name: 'Ayşe Demir',
      role: 'Proje Müdürü',
      message: 'Çelik endüstrisi projemizde Alp Dinamik\'in vidalı kriko ve yön değiştirici çözümleri mükemmel çalıştı. Devreye alma sürecinde sağladıkları teknik destek projenin başarısında kritik rol oynadı.',
      imageUrl: '/assets/img/team/team-2.jpg',
      rating: 5,
      order: 2,
    },
    {
      name: 'Can Özkan',
      role: 'Güneş Enerjisi Sistemleri Mühendisi',
      message: 'Güneş takip mekanizmamız için Alp Dinamik\'in önerdiği vidalı kriko çözümü, yüksek hassasiyet ve dayanıklılık gereksinimlerimizi karşıladı. Satış sonrası hizmetleri de çok profesyonel.',
      imageUrl: '/assets/img/team/team-3.jpg',
      rating: 5,
      order: 3,
    },
    {
      name: 'Zeynep Kaya',
      role: 'Savunma Sanayi Proje Lideri',
      message: 'Hareketli platform sistemimizde Alp Dinamik\'in lineer aktüatör seçimi ve mühendislik danışmanlığı projenin güvenli çalışmasını sağladı. Uçtan uca çözüm yaklaşımları takdire şayan.',
      imageUrl: '/assets/img/team/team-4.jpg',
      rating: 5,
      order: 4,
    },
    {
      name: 'Ali Çelik',
      role: 'Endüstriyel Tesis Müdürü',
      message: 'Alp Dinamik, sadece ürün tedarikçisi değil, gerçek bir mühendislik ortağı. Proje analizinden devreye almaya kadar her aşamada yanımızdaydılar. Kesinlikle tavsiye ederim.',
      imageUrl: '/assets/img/team/member-1.jpg',
      rating: 5,
      order: 5,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: {
        ...testimonial,
        isActive: true,
      },
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

