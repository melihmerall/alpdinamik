import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function RepresentativeProductsPage({
  params,
}: {
  params: { slug: string }
}) {
  const representative = await prisma.representative.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!representative) {
    notFound()
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Link href="/admin/representatives" className="admin-btn admin-btn-secondary admin-btn-sm">
            ← Geri
          </Link>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: 'var(--admin-gray-900)', 
              margin: '0 0 0.5rem' 
            }}>
              {representative.name} - Ürünler
            </h1>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--admin-gray-600)', 
              margin: 0 
            }}>
              {representative.name} markasına ait ürünleri yönetin
            </p>
          </div>
        </div>
        <Link
          href={`/admin/representatives/${params.slug}/products/new`}
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Ürün</span>
        </Link>
      </div>

      <div className="admin-card">
        {representative.products.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ürün Adı</th>
                  <th>Slug</th>
                  <th>Sıra</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {representative.products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ fontWeight: '500' }}>{product.name}</td>
                    <td style={{ color: 'var(--admin-gray-500)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {product.slug}
                    </td>
                    <td>{product.order}</td>
                    <td>
                      {product.isActive ? (
                        <span className="admin-badge admin-badge-success">Aktif</span>
                      ) : (
                        <span className="admin-badge admin-badge-warning">Pasif</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/representatives/${params.slug}/products/${product.slug}/edit`}
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
            <div className="admin-empty-state-icon">📦</div>
            <h3 className="admin-empty-state-title">Henüz ürün eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk ürününüzü ekleyerek başlayın
            </p>
            <Link 
              href={`/admin/representatives/${params.slug}/products/new`} 
              className="admin-btn admin-btn-primary"
            >
              Yeni Ürün Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

