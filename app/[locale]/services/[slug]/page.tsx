import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import ServicesSingle from '@/components/pages/services/service-single'

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  })

  if (!service) {
    return {
      title: 'Hizmet Bulunamadı',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alpdinamik.com.tr'
  const defaultTitle = `${service.title} - Alp Dinamik | Lineer Hareket Sistemleri`
  const defaultDescription = service.summary || service.title

  return {
    title: service.metaTitle || defaultTitle,
    description: service.metaDescription || defaultDescription,
    keywords: service.metaKeywords || undefined,
    openGraph: {
      title: service.metaTitle || service.title,
      description: service.metaDescription || defaultDescription,
      images: service.ogImage || service.imageUrl ? [
        {
          url: service.ogImage || service.imageUrl || '',
          width: 1200,
          height: 630,
          alt: service.title,
        }
      ] : [],
      type: 'website',
      url: `${siteUrl}/${params.locale}/services/${service.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle || service.title,
      description: service.metaDescription || defaultDescription,
      images: service.ogImage || service.imageUrl ? [service.ogImage || service.imageUrl || ''] : [],
    },
    alternates: {
      canonical: `${siteUrl}/${params.locale}/services/${service.slug}`,
    },
  }
}

export default async function ServiceDetailPage({ params }: { params: { slug: string; locale: string } }) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  })

  if (!service) {
    notFound()
  }

  // Transform API data to component format
  const singleData = {
    id: service.slug,
    title: service.title,
    icon: service.icon,
    summary: service.summary,
    body: service.body,
    imageUrl: service.imageUrl,
    breadcrumbImageUrl: service.breadcrumbImageUrl,
  }

  return <ServicesSingle singleData={singleData} />
}

