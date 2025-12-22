import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const getSourceBadge = (source: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      CONTACT_FORM: { label: 'İletişim', className: 'admin-badge-info' },
      PROJECT_FORM: { label: 'Proje', className: 'admin-badge-success' },
      QUICK_CONTACT: { label: 'Hızlı', className: 'admin-badge-warning' },
    }
    return badges[source] || { label: source, className: 'admin-badge' }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: 'var(--admin-gray-900)', 
          margin: '0 0 0.5rem' 
        }}>
          Talepler
        </h1>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--admin-gray-600)', 
          margin: 0 
        }}>
          Formlardan gelen tüm talepleri görüntüleyin ve yönetin
        </p>
      </div>

      <div className="admin-card">
        {leads.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Kaynak</th>
                  <th>Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const sourceBadge = getSourceBadge(lead.source)
                  return (
                    <tr key={lead.id}>
                      <td style={{ fontWeight: '500' }}>{lead.fullName}</td>
                      <td>{lead.email || <span style={{ color: 'var(--admin-gray-400)' }}>-</span>}</td>
                      <td>{lead.phone || <span style={{ color: 'var(--admin-gray-400)' }}>-</span>}</td>
                      <td>
                        <span className={sourceBadge.className}>{sourceBadge.label}</span>
                      </td>
                      <td style={{ color: 'var(--admin-gray-600)' }}>
                        {new Date(lead.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          Detay
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">📭</div>
            <h3 className="admin-empty-state-title">Henüz talep bulunmuyor</h3>
            <p className="admin-empty-state-description">
              Formlardan gelen talepler burada görüntülenecek
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
