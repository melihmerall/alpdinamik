import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function ReferencesPage() {
  const projects = await prisma.referenceProject.findMany({
    include: {
      sector: true,
    },
    orderBy: { createdAt: 'desc' },
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
            Referans Projeler
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Tamamlanan projelerinizi yönetin
          </p>
        </div>
        <Link
          href="/admin/references/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Proje</span>
        </Link>
      </div>

      <div className="admin-card">
        {projects.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Slug</th>
                  <th>Sektör</th>
                  <th>Yıl</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td style={{ fontWeight: '500' }}>{project.title}</td>
                    <td style={{ color: 'var(--admin-gray-500)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {project.slug}
                    </td>
                    <td>
                      {project.sector ? (
                        <span className="admin-badge admin-badge-info">{project.sector.name}</span>
                      ) : (
                        <span style={{ color: 'var(--admin-gray-400)' }}>-</span>
                      )}
                    </td>
                    <td>{project.year || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/references/${project.slug}/edit`}
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
            <div className="admin-empty-state-icon">⭐</div>
            <h3 className="admin-empty-state-title">Henüz referans proje eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk referans projenizi ekleyerek başlayın
            </p>
            <Link href="/admin/references/new" className="admin-btn admin-btn-primary">
              Yeni Proje Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
