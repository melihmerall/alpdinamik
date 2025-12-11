import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/middleware'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Route segment config for App Router
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for large file uploads

export async function POST(request: NextRequest) {
  const user = await verifyAuth()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'

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

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Write file
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/${folder}/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

