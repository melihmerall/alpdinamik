import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
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
            Müşteri Referansları
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Müşteri yorumlarını ve referanslarını yönetin
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="admin-btn admin-btn-primary"
        >
          <span>+</span>
          <span>Yeni Referans</span>
        </Link>
      </div>

      <div className="admin-card">
        {testimonials.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>Pozisyon / Şirket</th>
                  <th>Puan</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td style={{ fontWeight: '500' }}>{testimonial.name}</td>
                    <td style={{ color: 'var(--admin-gray-600)' }}>
                      {testimonial.role || '-'}
                      {testimonial.company && ` - ${testimonial.company}`}
                    </td>
                    <td>
                      <span style={{ color: '#fbbf24' }}>
                        {'⭐'.repeat(testimonial.rating || 5)}
                      </span>
                    </td>
                    <td>
                      {testimonial.isActive ? (
                        <span className="admin-badge admin-badge-success">Aktif</span>
                      ) : (
                        <span className="admin-badge admin-badge-warning">Pasif</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/testimonials/${testimonial.id}/edit`}
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
            <div className="admin-empty-state-icon">💬</div>
            <h3 className="admin-empty-state-title">Henüz referans eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk müşteri referansınızı ekleyerek başlayın
            </p>
            <Link href="/admin/testimonials/new" className="admin-btn admin-btn-primary">
              Yeni Referans Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
