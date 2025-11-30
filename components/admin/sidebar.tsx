"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/content-blocks', label: 'İçerik Blokları', icon: '📝' },
  { href: '/admin/company-pages', label: 'Kurumsal Sayfalar', icon: '🏢' },
  { href: '/admin/services', label: 'Hizmetler', icon: '⚙️' },
  { href: '/admin/sectors', label: 'Sektörler', icon: '🏭' },
  { href: '/admin/representatives', label: 'Temsilcilikler', icon: '🤝' },
  { href: '/admin/blog', label: 'Blog Yazıları', icon: '📰' },
  { href: '/admin/references', label: 'Referanslar', icon: '⭐' },
  { href: '/admin/banners', label: 'Bannerlar', icon: '🖼️' },
  { href: '/admin/leads', label: 'Talepler', icon: '📧' },
  { href: '/admin/users', label: 'Kullanıcılar', icon: '👤' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '250px',
      background: '#1f2937',
      color: 'white',
      padding: '1.5rem 0',
      minHeight: '100vh'
    }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          Alp Dinamik
        </h2>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', opacity: 0.7 }}>
          Admin Panel
        </p>
      </div>
      <nav>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: isActive ? '#fff' : '#d1d5db',
                background: isActive ? '#374151' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent'
              }}
            >
              <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

