import { redirect } from 'next/navigation'
import { verifyAuth } from '@/lib/middleware'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminDashboard() {
  const user = await verifyAuth()

  if (!user) {
    redirect('/admin/login')
  }

  const [leadsCount, blogCount, serviceCount, sectorCount, recentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.service.count(),
    prisma.sector.count(),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const stats = [
    {
      title: 'Toplam Talep',
      value: leadsCount,
      icon: '📧',
      color: 'primary',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Yayınlanan Blog',
      value: blogCount,
      icon: '📰',
      color: 'success',
      change: '+5',
      changeType: 'positive' as const,
    },
    {
      title: 'Hizmetler',
      value: serviceCount,
      icon: '⚙️',
      color: 'warning',
      change: null,
    },
    {
      title: 'Sektörler',
      value: sectorCount,
      icon: '🏭',
      color: 'danger',
      change: null,
    },
  ]

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
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-gray-900)', margin: '0 0 0.5rem' }}>
                Dashboard
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)', margin: 0 }}>
                Sistemin genel durumunu ve son aktiviteleri görüntüleyin
              </p>
            </div>

            <div className="admin-stats-grid">
              {stats.map((stat) => (
                <div key={stat.title} className="admin-stat-card">
                  <div className="admin-stat-card-header">
                    <div className={`admin-stat-card-icon ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="admin-stat-card-value">{stat.value}</div>
                  <div className="admin-stat-card-label">{stat.title}</div>
                  {stat.change && (
                    <div className={`admin-stat-card-change ${stat.changeType}`}>
                      {stat.change} bu ay
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Son Talepler</h2>
                <div className="admin-card-actions">
                  <Link href="/admin/leads" className="admin-btn admin-btn-secondary admin-btn-sm">
                    Tümünü Gör
                  </Link>
                </div>
              </div>
              {recentLeads.length > 0 ? (
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
                      {recentLeads.map((lead) => {
                        const sourceBadge = getSourceBadge(lead.source)
                        return (
                          <tr key={lead.id}>
                            <td style={{ fontWeight: '500' }}>{lead.fullName}</td>
                            <td>{lead.email || '-'}</td>
                            <td>{lead.phone || '-'}</td>
                            <td>
                              <span className={sourceBadge.className}>{sourceBadge.label}</span>
                            </td>
                            <td>{new Date(lead.createdAt).toLocaleDateString('tr-TR', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}</td>
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
    </div>
  )
}

