import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CompanyPagesPage() {
  const pages = await prisma.companyPage.findMany({
    orderBy: { slug: 'asc' },
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
            Kurumsal Sayfalar
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Hakkımızda, Misyon & Vizyon gibi sayfaları yönetin
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/admin/company-pages/home-about/edit"
            className="admin-btn admin-btn-secondary"
          >
            Ana Sayfa Hakkımızda
          </Link>
          <Link
            href="/admin/company-pages/new"
            className="admin-btn admin-btn-primary"
          >
            <span>+</span>
            <span>Yeni Sayfa</span>
          </Link>
        </div>
      </div>

      <div className="admin-card">
        {pages.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Slug</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td style={{ fontWeight: '500' }}>{page.title}</td>
                    <td style={{ color: 'var(--admin-gray-500)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {page.slug}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/company-pages/${page.slug}/edit`}
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
            <div className="admin-empty-state-icon">🏢</div>
            <h3 className="admin-empty-state-title">Henüz kurumsal sayfa eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk kurumsal sayfanızı ekleyerek başlayın
            </p>
            <Link href="/admin/company-pages/new" className="admin-btn admin-btn-primary">
              Yeni Sayfa Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
