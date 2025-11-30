import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function RepresentativesPage() {
  const representatives = await prisma.representative.findMany({
    include: {
      products: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
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
            Temsilcilikler
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Temsil ettiğiniz markaları ve ürünlerini yönetin
          </p>
        </div>
        <Link
          href="/admin/representatives/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Temsilcilik</span>
        </Link>
      </div>

      <div className="admin-card">
        {representatives.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>Slug</th>
                  <th>Ürün Sayısı</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {representatives.map((rep) => (
                  <tr key={rep.id}>
                    <td style={{ fontWeight: '500' }}>{rep.name}</td>
                    <td style={{ color: 'var(--admin-gray-500)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {rep.slug}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-info">{rep.products.length}</span>
                    </td>
                    <td>
                      {rep.isActive ? (
                        <span className="admin-badge admin-badge-success">Aktif</span>
                      ) : (
                        <span className="admin-badge admin-badge-warning">Pasif</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/representatives/${rep.slug}/edit`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          Düzenle
                        </Link>
                        <Link
                          href={`/admin/representatives/${rep.slug}/products`}
                          className="admin-btn admin-btn-primary admin-btn-sm"
                        >
                          Ürünler
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
            <div className="admin-empty-state-icon">🤝</div>
            <h3 className="admin-empty-state-title">Henüz temsilcilik eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk temsilciliğinizi ekleyerek başlayın
            </p>
            <Link href="/admin/representatives/new" className="admin-btn admin-btn-primary">
              Yeni Temsilcilik Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
