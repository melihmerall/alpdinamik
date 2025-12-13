import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const page = await prisma.companyPage.findUnique({
        where: { slug },
      })

      if (!page) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(page)
    }

    const pages = await prisma.companyPage.findMany({
      orderBy: { slug: 'asc' },
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching company pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company pages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    const {
      slug,
      title,
      subtitle,
      body,
      imageUrl,
      breadcrumbImageUrl,
      stat1Number,
      stat1Label,
      stat2Number,
      stat2Label,
      stat3Number,
      stat3Label,
      ctaLabel,
      ctaUrl,
      missionSubtitle,
      missionTitle,
      missionBody,
      missionImageUrl,
      visionSubtitle,
      visionTitle,
      visionBody,
      visionImageUrl,
      videoUrl,
      videoBackgroundImageUrl,
      certificationSubtitle,
      certificationTitle,
      certificationImageUrl,
      certificationStat1Number,
      certificationStat1Label,
      certificationStat2Number,
      certificationStat2Label,
      certificationStat3Number,
      certificationStat3Label,
      certificationStat4Number,
      certificationStat4Label,
      teamSubtitle,
      teamTitle,
    } = requestBody

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      )
    }

    const page = await prisma.companyPage.create({
      data: {
        slug,
        title,
        subtitle: subtitle || null,
        body: body || '',
        imageUrl: imageUrl || null,
        breadcrumbImageUrl: breadcrumbImageUrl || null,
        stat1Number: stat1Number || null,
        stat1Label: stat1Label || null,
        stat2Number: stat2Number || null,
        stat2Label: stat2Label || null,
        stat3Number: stat3Number || null,
        stat3Label: stat3Label || null,
        ctaLabel: ctaLabel || null,
        ctaUrl: ctaUrl || null,
        missionSubtitle: missionSubtitle || null,
        missionTitle: missionTitle || null,
        missionBody: missionBody || null,
        missionImageUrl: missionImageUrl || null,
        visionSubtitle: visionSubtitle || null,
        visionTitle: visionTitle || null,
        visionBody: visionBody || null,
        visionImageUrl: visionImageUrl || null,
        videoUrl: videoUrl || null,
        videoBackgroundImageUrl: videoBackgroundImageUrl || null,
        certificationSubtitle: certificationSubtitle || null,
        certificationTitle: certificationTitle || null,
        certificationImageUrl: certificationImageUrl || null,
        certificationStat1Number: certificationStat1Number || null,
        certificationStat1Label: certificationStat1Label || null,
        certificationStat2Number: certificationStat2Number || null,
        certificationStat2Label: certificationStat2Label || null,
        certificationStat3Number: certificationStat3Number || null,
        certificationStat3Label: certificationStat3Label || null,
        certificationStat4Number: certificationStat4Number || null,
        certificationStat4Label: certificationStat4Label || null,
        teamSubtitle: teamSubtitle || null,
        teamTitle: teamTitle || null,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating company page:', error)
    return NextResponse.json(
      { error: 'Failed to create company page' },
      { status: 500 }
    )
  }
}

