import { prisma } from '@/lib/db'

export default async function AdminDashboard() {
  const [leadsCount, blogCount, serviceCount, sectorCount] = await Promise.all([
    prisma.lead.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.service.count(),
    prisma.sector.count(),
  ])

  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
        Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard title="Toplam Talep" value={leadsCount} icon="📧" />
        <StatCard title="Yayınlanan Blog" value={blogCount} icon="📰" />
        <StatCard title="Hizmetler" value={serviceCount} icon="⚙️" />
        <StatCard title="Sektörler" value={sectorCount} icon="🏭" />
      </div>

      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
          Son Talepler
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>İsim</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>E-posta</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Telefon</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Kaynak</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {recentLeads.map((lead) => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.75rem' }}>{lead.fullName}</td>
                <td style={{ padding: '0.75rem' }}>{lead.email || '-'}</td>
                <td style={{ padding: '0.75rem' }}>{lead.phone || '-'}</td>
                <td style={{ padding: '0.75rem' }}>{lead.source}</td>
                <td style={{ padding: '0.75rem' }}>
                  {new Date(lead.createdAt).toLocaleDateString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {recentLeads.length === 0 && (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Henüz talep bulunmuyor
          </p>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '2rem', marginRight: '0.75rem' }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{value}</h3>
      </div>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{title}</p>
    </div>
  )
}

