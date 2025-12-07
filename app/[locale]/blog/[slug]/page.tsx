import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import BlogDetails from '@/components/pages/blogs/blog-details'

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.isPublished) {
    return {
      title: 'Blog Yazısı Bulunamadı',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alpdinamik.com.tr'
  const defaultTitle = `${post.title} - Alp Dinamik Blog`
  const defaultDescription = post.summary || post.title

  return {
    title: post.metaTitle || defaultTitle,
    description: post.metaDescription || defaultDescription,
    keywords: post.metaKeywords || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || defaultDescription,
      images: post.ogImage || post.imageUrl ? [
        {
          url: post.ogImage || post.imageUrl || '',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
      type: 'article',
      publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
      url: `${siteUrl}/${params.locale}/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || defaultDescription,
      images: post.ogImage || post.imageUrl ? [post.ogImage || post.imageUrl || ''] : [],
    },
    alternates: {
      canonical: `${siteUrl}/${params.locale}/blog/${post.slug}`,
    },
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string; locale: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.isPublished) {
    notFound()
  }

  // Transform API data to component format
  const singleData = {
    id: post.slug,
    title: post.title,
    image: {
      src: post.imageUrl || '/assets/img/blog/blog-1.jpg'
    },
    date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR') : '',
    comment: 0,
    body: post.body,
    summary: post.summary,
    breadcrumbImageUrl: post.breadcrumbImageUrl,
  }

  return <BlogDetails singleData={singleData} />
}

