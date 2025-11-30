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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Temsilcilikler</h1>
        <Link
          href="/admin/representatives/new"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          + Yeni Temsilcilik
        </Link>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>İsim</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Slug</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Ürün Sayısı</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Durum</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {representatives.map((rep) => (
              <tr key={rep.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '1rem' }}>{rep.name}</td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>{rep.slug}</td>
                <td style={{ padding: '1rem' }}>{rep.products.length}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    background: rep.isActive ? '#d1fae5' : '#fee2e2',
                    color: rep.isActive ? '#065f46' : '#991b1b'
                  }}>
                    {rep.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      href={`/admin/representatives/${rep.slug}/edit`}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                      }}
                    >
                      Düzenle
                    </Link>
                    <Link
                      href={`/admin/representatives/${rep.slug}/products`}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                      }}
                    >
                      Ürünler
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {representatives.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            Henüz temsilcilik eklenmemiş
          </div>
        )}
      </div>
    </div>
  )
}

