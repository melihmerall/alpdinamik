import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import PortfolioDetails from '@/components/pages/portfolio/portfolio-details'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await prisma.referenceProject.findUnique({
    where: { slug: params.slug },
    include: { sector: true },
  })

  if (!project) {
    return {
      title: 'Proje Bulunamadı',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alpdinamik.com.tr'
  const defaultTitle = `${project.title} - Alpdinamik Referans Projeleri`
  const defaultDescription = project.summary || project.title

  return {
    title: project.metaTitle || defaultTitle,
    description: project.metaDescription || defaultDescription,
    keywords: project.metaKeywords || undefined,
    openGraph: {
      title: project.metaTitle || project.title,
      description: project.metaDescription || defaultDescription,
      images: project.ogImage || project.imageUrl ? [
        {
          url: project.ogImage || project.imageUrl || '',
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ] : [],
      type: 'website',
      url: `${siteUrl}/portfolio/${project.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.metaTitle || project.title,
      description: project.metaDescription || defaultDescription,
      images: project.ogImage || project.imageUrl ? [project.ogImage || project.imageUrl || ''] : [],
    },
    alternates: {
      canonical: `${siteUrl}/portfolio/${project.slug}`,
    },
  }
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const project = await prisma.referenceProject.findUnique({
    where: { slug: params.slug },
    include: { sector: true },
  })

  if (!project) {
    notFound()
  }

  // Transform API data to component format
  const singleData = {
    id: project.slug,
    title: project.title,
    image: {
      src: project.imageUrl || '/assets/img/portfolio/portfolio-1.jpg'
    },
    category: project.sector?.name || project.summary,
    date: project.year?.toString() || '',
    body: project.body,
    summary: project.summary,
    breadcrumbImageUrl: project.breadcrumbImageUrl,
  }

  return <PortfolioDetails singleData={singleData} />
}

