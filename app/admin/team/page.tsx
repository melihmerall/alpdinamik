import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
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
            Ekip Üyeleri
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Ekip üyelerinizi yönetin
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Üye</span>
        </Link>
      </div>

      <div className="admin-card">
        {members.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>Pozisyon</th>
                  <th>Kategori</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td style={{ fontWeight: '500' }}>{member.name}</td>
                    <td>{member.role}</td>
                    <td>
                      {member.category ? (
                        <span className="admin-badge admin-badge-info">{member.category}</span>
                      ) : (
                        <span style={{ color: 'var(--admin-gray-400)' }}>-</span>
                      )}
                    </td>
                    <td>
                      {member.isActive ? (
                        <span className="admin-badge admin-badge-success">Aktif</span>
                      ) : (
                        <span className="admin-badge admin-badge-warning">Pasif</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/team/${member.slug}/edit`}
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
            <div className="admin-empty-state-icon">👥</div>
            <h3 className="admin-empty-state-title">Henüz ekip üyesi eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk ekip üyenizi ekleyerek başlayın
            </p>
            <Link href="/admin/team/new" className="admin-btn admin-btn-primary">
              Yeni Üye Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
