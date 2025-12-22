import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--admin-gray-900)', 
            margin: '0 0 0.5rem' 
          }}>
            Hizmetler
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Site üzerinde gösterilen hizmetleri yönetin
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Hizmet</span>
        </Link>
      </div>

      <div className="admin-card">
        {services.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Slug</th>
                  <th>Sıra</th>
                  <th>İkon</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td style={{ fontWeight: '500' }}>{service.title}</td>
                    <td style={{ color: 'var(--admin-gray-500)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {service.slug}
                    </td>
                    <td>{service.order}</td>
                    <td>
                      {service.icon ? (
                        <span style={{ fontSize: '1.25rem' }}>{service.icon}</span>
                      ) : (
                        <span style={{ color: 'var(--admin-gray-400)' }}>-</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/services/${service.slug}/edit`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          Düzenle
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">⚙️</div>
            <h3 className="admin-empty-state-title">Henüz hizmet eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk hizmetinizi ekleyerek başlayın
            </p>
            <Link href="/admin/services/new" className="admin-btn admin-btn-primary">
              Yeni Hizmet Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
