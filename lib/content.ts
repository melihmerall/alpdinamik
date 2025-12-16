import { unstable_cache } from 'next/cache'
import { prisma } from './db'

const DEFAULT_REVALIDATE = 300

function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  tags: string[],
  revalidate = DEFAULT_REVALIDATE
) {
  return unstable_cache(fn, keyParts, { tags, revalidate }) as T
}

export const getContentBlock = withCache(
  async (key: string) => {
    return prisma.contentBlock.findUnique({
      where: { key },
    })
  },
  ['content-block', 'single'],
  ['content-blocks']
)

export const getAllContentBlocks = withCache(
  async () => {
    return prisma.contentBlock.findMany({
      orderBy: { key: 'asc' },
    })
  },
  ['content-block', 'all'],
  ['content-blocks']
)

export const getCompanyPage = withCache(
  async (slug: string) => {
    return prisma.companyPage.findUnique({
      where: { slug },
    })
  },
  ['company-page', 'single'],
  ['company-pages']
)

export const getAllCompanyPages = withCache(
  async () => {
    return prisma.companyPage.findMany({
      orderBy: { slug: 'asc' },
    })
  },
  ['company-page', 'all'],
  ['company-pages']
)

export const getServices = withCache(
  async () => {
    return prisma.service.findMany({
      orderBy: { order: 'asc' },
    })
  },
  ['services', 'list'],
  ['services']
)

export const getService = withCache(
  async (slug: string) => {
    return prisma.service.findUnique({
      where: { slug },
    })
  },
  ['services', 'single'],
  ['services']
)

export const getSectors = withCache(
  async () => {
    return prisma.sector.findMany({
      orderBy: { order: 'asc' },
    })
  },
  ['sectors', 'list'],
  ['sectors']
)

export const getSector = withCache(
  async (slug: string) => {
    return prisma.sector.findUnique({
      where: { slug },
      include: {
        references: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  },
  ['sectors', 'single'],
  ['sectors']
)

export const getActiveBanners = withCache(
  async () => {
    return prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  },
  ['banners', 'active'],
  ['banners']
)

export const getActiveBannerMessages = withCache(
  async () => {
    return prisma.bannerMessage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  },
  ['banner-messages', 'active'],
  ['banner-messages']
)

export const getPublishedBlogPosts = withCache(
  async (limit?: number) => {
    return prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    })
  },
  ['blog-posts', 'published'],
  ['blog-posts']
)

export const getBlogPost = withCache(
  async (slug: string) => {
    return prisma.blogPost.findUnique({
      where: { slug },
    })
  },
  ['blog-posts', 'single'],
  ['blog-posts']
)

export const getReferenceProjects = withCache(
  async (limit?: number) => {
    return prisma.referenceProject.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        sector: true,
      },
    })
  },
  ['reference-projects', 'list'],
  ['reference-projects']
)

export const getReferenceProject = withCache(
  async (slug: string) => {
    return prisma.referenceProject.findUnique({
      where: { slug },
      include: {
        sector: true,
      },
    })
  },
  ['reference-projects', 'single'],
  ['reference-projects']
)

export const getActiveRepresentatives = withCache(
  async () => {
    return prisma.representative.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            series: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
              include: {
                variants: {
                  where: { isActive: true },
                  orderBy: { order: 'asc' },
                  include: {
                    products: {
                      where: { isActive: true },
                      orderBy: { order: 'asc' },
                      select: {
                        id: true,
                        slug: true,
                        name: true,
                      },
                    },
                  },
                },
                products: {
                  where: { isActive: true },
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    slug: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        products: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    })
  },
  ['representatives', 'active'],
  ['representatives']
)

export const getRepresentative = withCache(
  async (slug: string) => {
    return prisma.representative.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    })
  },
  ['representatives', 'single'],
  ['representatives']
)

export const getProduct = withCache(
  async (representativeSlug: string, productSlug: string) => {
    const representative = await prisma.representative.findUnique({
      where: { slug: representativeSlug },
    })

    if (!representative) return null

    return prisma.product.findFirst({
      where: {
        representativeId: representative.id,
        slug: productSlug,
        isActive: true,
      },
      include: {
        representative: true,
      },
    })
  },
  ['products', 'by-representative'],
  ['products']
)

export const getActiveTeamMembers = withCache(
  async (limit?: number) => {
    return prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: limit,
    })
  },
  ['team-members', 'active'],
  ['team-members']
)

export const getTeamMember = withCache(
  async (slug: string) => {
    return prisma.teamMember.findUnique({
      where: { slug },
    })
  },
  ['team-members', 'single'],
  ['team-members']
)

export const getActiveTestimonials = withCache(
  async (limit?: number) => {
    return prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: limit,
    })
  },
  ['testimonials', 'active'],
  ['testimonials']
)

export const getTestimonial = withCache(
  async (id: string) => {
    return prisma.testimonial.findUnique({
      where: { id },
    })
  },
  ['testimonials', 'single'],
  ['testimonials']
)
