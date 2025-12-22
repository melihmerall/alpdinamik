import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/middleware'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Route segment config for App Router
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for large file uploads

export async function POST(request: NextRequest) {
  console.log('[UPLOAD] Upload request received')
  
  try {
    const user = await verifyAuth()
    console.log('[UPLOAD] Auth check:', { hasUser: !!user, role: user?.role })
    
    if (!user || user.role !== 'ADMIN') {
      console.log('[UPLOAD] Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[UPLOAD] Parsing form data...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'
    
    console.log('[UPLOAD] File info:', { 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type,
      folder 
    })

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type - allow images and documents
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const allowedDocumentTypes = [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/octet-stream', // For DWG, DXF, X_T files
    ]
    const allowedExtensions = ['.pdf', '.zip', '.rar', '.7z', '.dwg', '.dxf', '.x_t']
    
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const isValidType = allowedImageTypes.includes(file.type) || 
                        allowedDocumentTypes.includes(file.type) ||
                        allowedExtensions.includes(fileExtension)
    
    if (!isValidType) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: Images (JPG, PNG, GIF, WebP), PDF, ZIP, RAR, 7Z, DWG, DXF, X_T' },
        { status: 400 }
      )
    }

    // Validate file size (max 500MB for documents, 5MB for images)
    const isImage = allowedImageTypes.includes(file.type)
    const maxSize = isImage ? 5 * 1024 * 1024 : 500 * 1024 * 1024 // 5MB for images, 500MB for documents
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${isImage ? '5MB' : '500MB'} limit` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${originalName}`

    // Next.js standalone build uses .next/standalone/public for serving
    // Try standalone first, fallback to public
    const standaloneUploadDir = join(process.cwd(), '.next', 'standalone', 'public', 'uploads', folder)
    const publicUploadDir = join(process.cwd(), 'public', 'uploads', folder)
    
    // Determine which directory to use
    let uploadDir = publicUploadDir
    let filepath = join(uploadDir, filename)
    
    // Check if standalone directory exists (production build)
    if (existsSync(join(process.cwd(), '.next', 'standalone'))) {
      uploadDir = standaloneUploadDir
      filepath = join(uploadDir, filename)
      console.log('[UPLOAD] Using standalone directory:', uploadDir)
    } else {
      console.log('[UPLOAD] Using public directory:', uploadDir)
    }
    
    // Create upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      console.log('[UPLOAD] Creating directory:', uploadDir)
      await mkdir(uploadDir, { recursive: true })
      console.log('[UPLOAD] Directory created')
    }

    // Write file
    console.log('[UPLOAD] Writing file to:', filepath)
    await writeFile(filepath, buffer)
    console.log('[UPLOAD] File written successfully, size:', buffer.length, 'bytes')
    
    // Also write to public directory for volume mount compatibility
    if (uploadDir !== publicUploadDir) {
      const publicFilepath = join(publicUploadDir, filename)
      if (!existsSync(publicUploadDir)) {
        await mkdir(publicUploadDir, { recursive: true })
      }
      await writeFile(publicFilepath, buffer)
      console.log('[UPLOAD] Also written to public directory:', publicFilepath)
    }
    
    // Verify file exists
    if (!existsSync(filepath)) {
      console.error('[UPLOAD] ERROR: File was not created!', filepath)
      throw new Error('File was not created after write')
    }
    console.log('[UPLOAD] File verified, exists:', existsSync(filepath))

    // Get base URL from request or environment
    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 
                    (host.includes('localhost') ? 'http' : 'https')
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (host ? `${protocol}://${host}` : 'https://alpdinamik.com.tr')
    
    // Return public URL (relative for client-side, but we have baseUrl available)
    const relativeUrl = `/uploads/${folder}/${filename}`
    const absoluteUrl = `${baseUrl}${relativeUrl}`

    console.log('[UPLOAD] Upload successful:', { relativeUrl, absoluteUrl, filename })
    
    return NextResponse.json({
      success: true,
      url: relativeUrl, // Keep relative for client-side usage
      absoluteUrl: absoluteUrl, // Also provide absolute URL for email/API usage
      filename: filename,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
    })
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

