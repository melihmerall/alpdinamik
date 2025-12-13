import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params)
  const lead = await prisma.lead.findUnique({
    where: { id: resolvedParams.id },
  })

  if (!lead) {
    notFound()
  }

  const getSourceBadge = (source: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      CONTACT_FORM: { label: 'İletişim Formu', className: 'admin-badge-info' },
      PROJECT_FORM: { label: 'Proje Formu', className: 'admin-badge-success' },
      QUICK_CONTACT: { label: 'Hızlı İletişim', className: 'admin-badge-warning' },
    }
    return badges[source] || { label: source, className: 'admin-badge' }
  }

  const sourceBadge = getSourceBadge(lead.source)
  const meta = lead.meta as any || {}

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--admin-gray-900)', 
            margin: '0 0 0.5rem' 
          }}>
            Talep Detayı
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Formdan gelen talep detaylarını görüntüleyin
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="admin-btn admin-btn-secondary"
        >
          ← Geri Dön
        </Link>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--admin-gray-500)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              Ad Soyad
            </label>
            <div style={{ 
              fontSize: '1rem', 
              color: 'var(--admin-gray-900)', 
              fontWeight: '500' 
            }}>
              {lead.fullName}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--admin-gray-500)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              E-posta
            </label>
            <div style={{ 
              fontSize: '1rem', 
              color: 'var(--admin-gray-900)' 
            }}>
              {lead.email ? (
                <a 
                  href={`mailto:${lead.email}`}
                  style={{ 
                    color: 'var(--admin-primary)', 
                    textDecoration: 'none' 
                  }}
                >
                  {lead.email}
                </a>
              ) : (
                <span style={{ color: 'var(--admin-gray-400)' }}>-</span>
              )}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--admin-gray-500)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              Telefon
            </label>
            <div style={{ 
              fontSize: '1rem', 
              color: 'var(--admin-gray-900)' 
            }}>
              {lead.phone ? (
                <a 
                  href={`tel:${lead.phone.replace(/\s/g, '')}`}
                  style={{ 
                    color: 'var(--admin-primary)', 
                    textDecoration: 'none' 
                  }}
                >
                  {lead.phone}
                </a>
              ) : (
                <span style={{ color: 'var(--admin-gray-400)' }}>-</span>
              )}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--admin-gray-500)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              Kaynak
            </label>
            <div>
              <span className={sourceBadge.className}>{sourceBadge.label}</span>
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--admin-gray-500)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              Oluşturulma Tarihi
            </label>
            <div style={{ 
              fontSize: '1rem', 
              color: 'var(--admin-gray-900)' 
            }}>
              {new Date(lead.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--admin-gray-500)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              Güncellenme Tarihi
            </label>
            <div style={{ 
              fontSize: '1rem', 
              color: 'var(--admin-gray-900)' 
            }}>
              {new Date(lead.updatedAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {lead.message && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: 'var(--admin-gray-900)', 
            margin: '0 0 1rem' 
          }}>
            Mesaj
          </h2>
          <div style={{ 
            fontSize: '0.95rem', 
            color: 'var(--admin-gray-700)', 
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            padding: '1rem',
            background: 'var(--admin-gray-50)',
            borderRadius: '8px'
          }}>
            {lead.message}
          </div>
        </div>
      )}

      {Object.keys(meta).length > 0 && (
        <div className="admin-card">
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: 'var(--admin-gray-900)', 
            margin: '0 0 1rem' 
          }}>
            Ek Bilgiler
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {meta.kvkk !== undefined && (
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: 'var(--admin-gray-500)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  KVKK Onayı
                </label>
                <div>
                  <span className={meta.kvkk ? 'admin-badge-success' : 'admin-badge-error'}>
                    {meta.kvkk ? 'Onaylandı' : 'Onaylanmadı'}
                  </span>
                </div>
              </div>
            )}

            {meta.fileName && (
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: 'var(--admin-gray-500)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Yüklenen Dosya
                </label>
                <div style={{ 
                  fontSize: '1rem', 
                  color: 'var(--admin-gray-900)' 
                }}>
                  {meta.fileUrl ? (
                    <a 
                      href={meta.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: 'var(--admin-primary)', 
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <i className="fas fa-file-download" style={{ fontSize: '0.875rem' }}></i>
                      {meta.fileName}
                      {meta.fileSize && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--admin-gray-500)',
                          marginLeft: '0.5rem'
                        }}>
                          ({(meta.fileSize / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      )}
                    </a>
                  ) : (
                    <span>{meta.fileName}</span>
                  )}
                </div>
              </div>
            )}

            {meta.subject && (
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: 'var(--admin-gray-500)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Konu
                </label>
                <div style={{ 
                  fontSize: '1rem', 
                  color: 'var(--admin-gray-900)' 
                }}>
                  {meta.subject}
                </div>
              </div>
            )}

            {Object.entries(meta).map(([key, value]) => {
              if (['kvkk', 'fileName', 'fileUrl', 'fileSize', 'subject'].includes(key)) {
                return null
              }
              return (
                <div key={key}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    color: 'var(--admin-gray-500)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    {key}
                  </label>
                  <div style={{ 
                    fontSize: '1rem', 
                    color: 'var(--admin-gray-900)' 
                  }}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

