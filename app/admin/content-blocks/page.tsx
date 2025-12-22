import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ContentBlocksPage() {
  const blocks = await prisma.contentBlock.findMany({
    orderBy: { key: 'asc' },
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
            İçerik Blokları
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Site genelindeki statik metinleri yönetin
          </p>
        </div>
        <Link
          href="/admin/content-blocks/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Blok</span>
        </Link>
      </div>

      <div className="admin-card">
        {blocks.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Başlık</th>
                  <th>İçerik Önizleme</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block) => (
                  <tr key={block.id}>
                    <td style={{ 
                      fontFamily: 'monospace', 
                      color: 'var(--admin-gray-500)', 
                      fontSize: '0.8125rem' 
                    }}>
                      {block.key}
                    </td>
                    <td style={{ fontWeight: '500' }}>{block.title || '-'}</td>
                    <td style={{ 
                      color: 'var(--admin-gray-600)', 
                      maxWidth: '400px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {block.body ? block.body.substring(0, 60) + '...' : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/content-blocks/${block.key}/edit`}
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
            <div className="admin-empty-state-icon">📝</div>
            <h3 className="admin-empty-state-title">Henüz içerik bloğu eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk içerik bloğunuzu ekleyerek başlayın
            </p>
            <Link href="/admin/content-blocks/new" className="admin-btn admin-btn-primary">
              Yeni Blok Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
