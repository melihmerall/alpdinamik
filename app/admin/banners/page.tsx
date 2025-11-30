import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({
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
            Bannerlar
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Ana sayfa hero banner'larını yönetin
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Banner</span>
        </Link>
      </div>

      <div className="admin-card">
        {banners.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Alt Başlık</th>
                  <th>Durum</th>
                  <th>Sıra</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id}>
                    <td style={{ fontWeight: '500' }}>{banner.title}</td>
                    <td style={{ color: 'var(--admin-gray-600)' }}>
                      {banner.subtitle || '-'}
                    </td>
                    <td>
                      {banner.isActive ? (
                        <span className="admin-badge admin-badge-success">Aktif</span>
                      ) : (
                        <span className="admin-badge admin-badge-warning">Pasif</span>
                      )}
                    </td>
                    <td>{banner.order}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/banners/${banner.id}/edit`}
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
            <div className="admin-empty-state-icon">🖼️</div>
            <h3 className="admin-empty-state-title">Henüz banner eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk banner'ınızı ekleyerek başlayın
            </p>
            <Link href="/admin/banners/new" className="admin-btn admin-btn-primary">
              Yeni Banner Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
