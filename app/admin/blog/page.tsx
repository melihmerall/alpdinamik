import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
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
            Blog Yazıları
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Blog yazılarınızı yönetin ve yayınlayın
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Yazı</span>
        </Link>
      </div>

      <div className="admin-card">
        {posts.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Slug</th>
                  <th>Durum</th>
                  <th>Yayın Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ fontWeight: '500' }}>{post.title}</td>
                    <td style={{ color: 'var(--admin-gray-500)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {post.slug}
                    </td>
                    <td>
                      {post.isPublished ? (
                        <span className="admin-badge admin-badge-success">Yayında</span>
                      ) : (
                        <span className="admin-badge admin-badge-warning">Taslak</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--admin-gray-600)' }}>
                      {post.publishedAt 
                        ? new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : '-'
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/blog/${post.slug}/edit`}
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
            <div className="admin-empty-state-icon">📰</div>
            <h3 className="admin-empty-state-title">Henüz blog yazısı eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk blog yazınızı ekleyerek başlayın
            </p>
            <Link href="/admin/blog/new" className="admin-btn admin-btn-primary">
              Yeni Yazı Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
