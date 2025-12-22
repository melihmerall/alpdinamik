import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import path from 'path';
import { promises as fs } from 'fs';

const FALLBACK_ICON_PATH = path.join(process.cwd(), 'public', 'favicon.ico');

async function loadFallbackIcon() {
  try {
    const fileBuffer = await fs.readFile(FALLBACK_ICON_PATH);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error loading fallback favicon:', error);
    return NextResponse.json({ error: 'Favicon not found' }, { status: 404 });
  }
}

export async function GET(request: Request) {
  try {
    const settings = await prisma.siteSettings.findFirst();

    if (settings?.faviconUrl) {
      const faviconUrl = settings.faviconUrl.startsWith('http')
        ? settings.faviconUrl
        : new URL(settings.faviconUrl, request.url).toString();

      return NextResponse.redirect(faviconUrl, {
        headers: {
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return await loadFallbackIcon();
  } catch (error) {
    console.error('Error serving favicon:', error);
    return await loadFallbackIcon();
  }
}
