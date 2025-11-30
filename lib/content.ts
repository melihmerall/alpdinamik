import { prisma } from './db'

// Get content block by key
export async function getContentBlock(key: string) {
  const block = await prisma.contentBlock.findUnique({
    where: { key },
  })
  return block
}

// Get all content blocks
export async function getAllContentBlocks() {
  return await prisma.contentBlock.findMany({
    orderBy: { key: 'asc' },
  })
}

// Get company page by slug
export async function getCompanyPage(slug: string) {
  return await prisma.companyPage.findUnique({
    where: { slug },
  })
}

// Get all company pages
export async function getAllCompanyPages() {
  return await prisma.companyPage.findMany({
    orderBy: { slug: 'asc' },
  })
}

// Get services ordered by order field
export async function getServices() {
  return await prisma.service.findMany({
    orderBy: { order: 'asc' },
  })
}

// Get service by slug
export async function getService(slug: string) {
  return await prisma.service.findUnique({
    where: { slug },
  })
}

// Get sectors ordered by order field
export async function getSectors() {
  return await prisma.sector.findMany({
    orderBy: { order: 'asc' },
  })
}

// Get sector by slug
export async function getSector(slug: string) {
  return await prisma.sector.findUnique({
    where: { slug },
    include: {
      references: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

// Get active banners ordered by order
export async function getActiveBanners() {
  return await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })
}

// Get active banner messages
export async function getActiveBannerMessages() {
  return await prisma.bannerMessage.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })
}

// Get published blog posts
export async function getPublishedBlogPosts(limit?: number) {
  return await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

// Get blog post by slug
export async function getBlogPost(slug: string) {
  return await prisma.blogPost.findUnique({
    where: { slug },
  })
}

// Get reference projects
export async function getReferenceProjects(limit?: number) {
  return await prisma.referenceProject.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      sector: true,
    },
  })
}

// Get reference project by slug
export async function getReferenceProject(slug: string) {
  return await prisma.referenceProject.findUnique({
    where: { slug },
    include: {
      sector: true,
    },
  })
}

// Get active representatives with products
export async function getActiveRepresentatives() {
  return await prisma.representative.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
  })
}

// Get representative by slug
export async function getRepresentative(slug: string) {
  return await prisma.representative.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
  })
}

// Get product by representative slug and product slug
export async function getProduct(representativeSlug: string, productSlug: string) {
  const representative = await prisma.representative.findUnique({
    where: { slug: representativeSlug },
  })

  if (!representative) return null

  return await prisma.product.findFirst({
    where: {
      representativeId: representative.id,
      slug: productSlug,
      isActive: true,
    },
    include: {
      representative: true,
    },
  })
}

// Get active team members
export async function getActiveTeamMembers(limit?: number) {
  return await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: limit,
  })
}

// Get team member by slug
export async function getTeamMember(slug: string) {
  return await prisma.teamMember.findUnique({
    where: { slug },
  })
}

// Get active testimonials
export async function getActiveTestimonials(limit?: number) {
  return await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: limit,
  })
}

// Get testimonial by id
export async function getTestimonial(id: string) {
  return await prisma.testimonial.findUnique({
    where: { id },
  })
}

