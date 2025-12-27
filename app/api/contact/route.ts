import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/lib/leads'
import { LeadSource } from '@prisma/client'
import { prisma } from '@/lib/db'
import nodemailer from 'nodemailer'

// Basit rate limiting (in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 dakika
const RATE_LIMIT_MAX_REQUESTS = 5 // 15 dakikada maksimum 5 istek

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIP || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    // Yeni kayıt veya süre dolmuş
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false // Rate limit aşıldı
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting kontrolü
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen bir süre sonra tekrar deneyin.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Bot koruması: Honeypot field kontrolü (meta içinde gönderilmemeli)
    if (body.meta?.website || body.website) {
      console.warn('Bot tespit edildi: honeypot field gönderildi', { ip: clientIP })
      return NextResponse.json(
        { error: 'Güvenlik kontrolü başarısız.' },
        { status: 400 }
      )
    }

    // Bot koruması: Çok kısa mesaj kontrolü (spam olabilir)
    if (body.message && body.message.trim().length < 10) {
      console.warn('Şüpheli mesaj: çok kısa mesaj', { ip: clientIP, messageLength: body.message.length })
      return NextResponse.json(
        { error: 'Mesaj çok kısa. Lütfen daha detaylı bilgi verin.' },
        { status: 400 }
      )
    }

    // Bot koruması: Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (body.email && !emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta adresi.' },
        { status: 400 }
      )
    }
    
    // Get base URL from request headers or environment
    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 
                    (host.includes('localhost') ? 'http' : 'https')
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (host ? `${protocol}://${host}` : 'https://alpdinamik.com.tr')
    
    const leadData = {
      fullName: body.fullName || body.name || '',
      email: body.email || null,
      phone: body.phone || null,
      source: (body.source as LeadSource) || LeadSource.CONTACT_FORM,
      message: body.message || null,
      meta: body.meta || {},
    }

    // Create lead in database
    const lead = await createLead(leadData)

    // Send email notification
    try {
      const settings = await prisma.siteSettings.findFirst()
      
      if (settings?.smtpHost && settings?.smtpUser && settings?.smtpPassword && settings?.contactEmail) {
        // SMTP port validation - 995 is POP3, use 465 for SMTP SSL or 587 for TLS
        let smtpPort = settings.smtpPort || 465
        
        // Fix: If port is 995 (POP3), change to 465 (SMTP SSL)
        if (smtpPort === 995) {
          console.warn('Port 995 is POP3, changing to 465 for SMTP')
          smtpPort = 465
        }
        
        // Port 465 uses SSL, port 587 uses STARTTLS
        const isSecure = smtpPort === 465
        
        console.log('SMTP Config:', {
          host: settings.smtpHost,
          port: smtpPort,
          secure: isSecure,
          user: settings.smtpUser
        })
        
        const transporter = nodemailer.createTransport({
          host: settings.smtpHost,
          port: smtpPort,
          secure: isSecure, // true for 465 (SSL), false for 587 (TLS/STARTTLS)
          auth: {
            user: settings.smtpUser,
            pass: settings.smtpPassword,
          },
          tls: {
            rejectUnauthorized: false, // Allow self-signed certificates
            ciphers: 'SSLv3'
          },
          // For MailEnable and similar servers
          requireTLS: smtpPort === 587,
          connectionTimeout: 10000,
          greetingTimeout: 10000
        })

        // Convert relative file URL to absolute URL
        let fileUrl = body.meta?.fileUrl
        if (fileUrl && fileUrl.startsWith('/')) {
          fileUrl = `${baseUrl}${fileUrl}`
        }

        const subject = body.meta?.subject || body.message?.substring(0, 50) || 'İletişim Formu';
        
        const htmlEmail = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yeni İletişim Formu</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Yeni İletişim Formu</h1>
                            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Alpdinamik Web Sitesi</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px; padding: 15px;">
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <strong style="color: #333; font-size: 14px; display: inline-block; min-width: 120px;">Ad Soyad:</strong>
                                                    <span style="color: #666; font-size: 14px;">${leadData.fullName || 'Belirtilmemiş'}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                                                    <strong style="color: #333; font-size: 14px; display: inline-block; min-width: 120px;">E-posta:</strong>
                                                    <a href="mailto:${leadData.email || ''}" style="color: #667eea; font-size: 14px; text-decoration: none;">${leadData.email || 'Belirtilmemiş'}</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                                                    <strong style="color: #333; font-size: 14px; display: inline-block; min-width: 120px;">Telefon:</strong>
                                                    <a href="tel:${leadData.phone?.replace(/\s/g, '') || ''}" style="color: #667eea; font-size: 14px; text-decoration: none;">${leadData.phone || 'Belirtilmemiş'}</a>
                                                </td>
                                            </tr>
                                            ${body.meta?.subject ? `
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                                                    <strong style="color: #333; font-size: 14px; display: inline-block; min-width: 120px;">Konu:</strong>
                                                    <span style="color: #666; font-size: 14px;">${body.meta.subject}</span>
                                                </td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                                
                                ${leadData.message ? `
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">Mesaj İçeriği</h3>
                                        <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; border-radius: 4px;">
                                            <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${leadData.message.replace(/\n/g, '<br>')}</p>
                                        </div>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                ${fileUrl ? `
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">Eklenen Dosya</h3>
                                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef;">
                                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                                                <strong>Dosya Adı:</strong> ${body.meta?.fileName || 'Dosya'}<br>
                                                ${body.meta?.fileSize ? `<strong>Dosya Boyutu:</strong> ${(body.meta.fileSize / 1024 / 1024).toFixed(2)} MB<br>` : ''}
                                            </p>
                                            <a href="${fileUrl}" style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500; margin-top: 10px;">Dosyayı İndir</a>
                                        </div>
                                    </td>
                                </tr>
                                ` : ''}
                                
                                <tr>
                                    <td>
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px; padding: 15px;">
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <strong style="color: #333; font-size: 14px;">KVKK Onayı:</strong>
                                                    <span style="color: ${body.meta?.kvkk ? '#22c55e' : '#ef4444'}; font-size: 14px; font-weight: 600; margin-left: 10px;">
                                                        ${body.meta?.kvkk ? '✓ Onaylandı' : '✗ Onaylanmadı'}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                                                    <strong style="color: #333; font-size: 14px;">Gönderim Tarihi:</strong>
                                                    <span style="color: #666; font-size: 14px; margin-left: 10px;">${new Date().toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; color: #999; font-size: 12px;">Bu e-posta Alpdinamik web sitesi iletişim formundan otomatik olarak gönderilmiştir.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();

        const mailOptions = {
          from: `"Alpdinamik Web Sitesi" <${settings.smtpUser}>`,
          to: settings.contactEmail,
          subject: `Yeni İletişim Formu: ${subject}`,
          html: htmlEmail,
        }

        await transporter.sendMail(mailOptions)
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}

