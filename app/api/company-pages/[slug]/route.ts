import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const page = await prisma.companyPage.findUnique({
      where: { slug: resolvedParams.slug },
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Cache for 5 minutes (300 seconds) - company pages don't change frequently
    return NextResponse.json(page, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching company page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company page' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const requestBody = await request.json()
    const {
      title,
      subtitle,
      body: bodyContent,
      imageUrl,
      image2Url,
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

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle || null
    if (bodyContent !== undefined) updateData.body = bodyContent
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null
    if (image2Url !== undefined) updateData.image2Url = image2Url || null
    if (breadcrumbImageUrl !== undefined) updateData.breadcrumbImageUrl = breadcrumbImageUrl || null
    if (stat1Number !== undefined) updateData.stat1Number = stat1Number !== null && stat1Number !== '' ? stat1Number : null
    if (stat1Label !== undefined) updateData.stat1Label = stat1Label || null
    if (stat2Number !== undefined) updateData.stat2Number = stat2Number !== null && stat2Number !== '' ? stat2Number : null
    if (stat2Label !== undefined) updateData.stat2Label = stat2Label || null
    if (stat3Number !== undefined) updateData.stat3Number = stat3Number !== null && stat3Number !== '' ? stat3Number : null
    if (stat3Label !== undefined) updateData.stat3Label = stat3Label || null
    if (ctaLabel !== undefined) updateData.ctaLabel = ctaLabel || null
    if (ctaUrl !== undefined) updateData.ctaUrl = ctaUrl || null
    if (missionSubtitle !== undefined) updateData.missionSubtitle = missionSubtitle || null
    if (missionTitle !== undefined) updateData.missionTitle = missionTitle || null
    if (missionBody !== undefined) updateData.missionBody = missionBody || null
    if (missionImageUrl !== undefined) updateData.missionImageUrl = missionImageUrl || null
    if (visionSubtitle !== undefined) updateData.visionSubtitle = visionSubtitle || null
    if (visionTitle !== undefined) updateData.visionTitle = visionTitle || null
    if (visionBody !== undefined) updateData.visionBody = visionBody || null
    if (visionImageUrl !== undefined) updateData.visionImageUrl = visionImageUrl || null
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl || null
    if (videoBackgroundImageUrl !== undefined) updateData.videoBackgroundImageUrl = videoBackgroundImageUrl || null
    if (certificationSubtitle !== undefined) updateData.certificationSubtitle = certificationSubtitle || null
    if (certificationTitle !== undefined) updateData.certificationTitle = certificationTitle || null
    if (certificationImageUrl !== undefined) updateData.certificationImageUrl = certificationImageUrl || null
    if (certificationStat1Number !== undefined) updateData.certificationStat1Number = certificationStat1Number || null
    if (certificationStat1Label !== undefined) updateData.certificationStat1Label = certificationStat1Label || null
    if (certificationStat2Number !== undefined) updateData.certificationStat2Number = certificationStat2Number || null
    if (certificationStat2Label !== undefined) updateData.certificationStat2Label = certificationStat2Label || null
    if (certificationStat3Number !== undefined) updateData.certificationStat3Number = certificationStat3Number || null
    if (certificationStat3Label !== undefined) updateData.certificationStat3Label = certificationStat3Label || null
    if (certificationStat4Number !== undefined) updateData.certificationStat4Number = certificationStat4Number || null
    if (certificationStat4Label !== undefined) updateData.certificationStat4Label = certificationStat4Label || null
    if (teamSubtitle !== undefined) updateData.teamSubtitle = teamSubtitle || null
    if (teamTitle !== undefined) updateData.teamTitle = teamTitle || null

    const page = await prisma.companyPage.update({
      where: { slug: resolvedParams.slug },
      data: updateData,
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating company page:', error)
    return NextResponse.json(
      { error: 'Failed to update company page' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    await prisma.companyPage.delete({
      where: { slug: resolvedParams.slug },
    })

    return NextResponse.json({ message: 'Company page deleted successfully' })
  } catch (error) {
    console.error('Error deleting company page:', error)
    return NextResponse.json(
      { error: 'Failed to delete company page' },
      { status: 500 }
    )
  }
}

