import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function SectorsPage() {
  const sectors = await prisma.sector.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { references: true }
      }
    }
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
            Sektörler
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Hizmet verdiğiniz sektörleri yönetin
          </p>
        </div>
        <Link
          href="/admin/sectors/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Sektör</span>
        </Link>
      </div>

      <div className="admin-card">
        {sectors.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>Slug</th>
                  <th>Proje Sayısı</th>
                  <th>Sıra</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((sector) => (
                  <tr key={sector.id}>
                    <td style={{ fontWeight: '500' }}>{sector.name}</td>
                    <td style={{ color: 'var(--admin-gray-500)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {sector.slug}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-info">{sector._count.references}</span>
                    </td>
                    <td>{sector.order}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/sectors/${sector.slug}/edit`}
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
            <div className="admin-empty-state-icon">🏭</div>
            <h3 className="admin-empty-state-title">Henüz sektör eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk sektörünüzü ekleyerek başlayın
            </p>
            <Link href="/admin/sectors/new" className="admin-btn admin-btn-primary">
              Yeni Sektör Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
