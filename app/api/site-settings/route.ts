import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Get site settings (always returns first record or creates default)
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst()

    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {},
      })
    }

    // Cache for 5 minutes (300 seconds)
    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    )
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      defaultBreadcrumbImageUrl,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
      behanceUrl,
      email,
      phone,
      address,
      mapEmbedUrl,
      siteName,
      siteDescription,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      smtpSecure,
      contactEmail,
      kvkkText,
      contactFormTitle,
      contactFormSubtitle,
      contactFormNote,
      faviconUrl,
    } = body

    // Get or create settings
    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {},
      })
    }

    // Update settings - convert empty strings to null
    const updateData: any = {}
    if (defaultBreadcrumbImageUrl !== undefined) updateData.defaultBreadcrumbImageUrl = defaultBreadcrumbImageUrl?.trim() || null
    if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl?.trim() || null
    if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl?.trim() || null
    if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl?.trim() || null
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl?.trim() || null
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl?.trim() || null
    if (behanceUrl !== undefined) updateData.behanceUrl = behanceUrl?.trim() || null
    if (email !== undefined) updateData.email = email?.trim() || null
    if (phone !== undefined) updateData.phone = phone?.trim() || null
    if (address !== undefined) updateData.address = address?.trim() || null
    if (mapEmbedUrl !== undefined) updateData.mapEmbedUrl = mapEmbedUrl?.trim() || null
    if (siteName !== undefined) updateData.siteName = siteName?.trim() || null
    if (siteDescription !== undefined) updateData.siteDescription = siteDescription?.trim() || null
    if (smtpHost !== undefined) updateData.smtpHost = smtpHost?.trim() || null
    if (smtpPort !== undefined) updateData.smtpPort = smtpPort ? parseInt(smtpPort.toString()) : null
    if (smtpUser !== undefined) updateData.smtpUser = smtpUser?.trim() || null
    // Only update password if it's provided and not empty
    if (smtpPassword !== undefined && smtpPassword?.trim()) {
      updateData.smtpPassword = smtpPassword.trim()
    }
    if (smtpSecure !== undefined) updateData.smtpSecure = smtpSecure
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail?.trim() || null
    if (kvkkText !== undefined) updateData.kvkkText = kvkkText?.trim() || null
    if (contactFormTitle !== undefined) updateData.contactFormTitle = contactFormTitle?.trim() || null
    if (contactFormSubtitle !== undefined) updateData.contactFormSubtitle = contactFormSubtitle?.trim() || null
    if (contactFormNote !== undefined) updateData.contactFormNote = contactFormNote?.trim() || null
    if (faviconUrl !== undefined) updateData.faviconUrl = faviconUrl?.trim() || null

    console.log('Updating site settings with data:', updateData) // Debug log

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: updateData,
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    )
  }
}

