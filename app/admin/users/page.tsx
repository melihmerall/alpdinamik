import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
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
            Kullanıcılar
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Admin panel kullanıcılarını yönetin
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Kullanıcı</span>
        </Link>
      </div>

      <div className="admin-card">
        {users.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>E-posta</th>
                  <th>Rol</th>
                  <th>Oluşturulma</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: '500' }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === 'ADMIN' ? (
                        <span className="admin-badge admin-badge-danger">Yönetici</span>
                      ) : (
                        <span className="admin-badge admin-badge-info">Editör</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--admin-gray-600)' }}>
                      {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
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
            <div className="admin-empty-state-icon">👤</div>
            <h3 className="admin-empty-state-title">Henüz kullanıcı eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk kullanıcınızı ekleyerek başlayın
            </p>
            <Link href="/admin/users/new" className="admin-btn admin-btn-primary">
              Yeni Kullanıcı Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
