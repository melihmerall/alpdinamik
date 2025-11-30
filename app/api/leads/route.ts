import { NextRequest, NextResponse } from 'next/server'
import { createLead, LeadSource } from '@/lib/leads'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const leadData = {
      fullName: body.fullName || body.name || '',
      email: body.email || null,
      phone: body.phone || null,
      source: (body.source as LeadSource) || LeadSource.CONTACT_FORM,
      message: body.message || null,
      meta: body.meta || {},
    }

    // Add file info if exists
    if (body.fileName) {
      leadData.meta = {
        ...leadData.meta,
        fileName: body.fileName,
        fileSize: body.fileSize,
      }
    }

    const lead = await createLead(leadData)
    
    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}

