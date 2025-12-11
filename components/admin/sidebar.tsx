"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  {
    group: 'Ana',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊' },
    ]
  },
  {
    group: 'İçerik',
    items: [
      { href: '/admin/content-blocks', label: 'İçerik Blokları', icon: '📝' },
      { href: '/admin/about', label: 'Hakkımızda', icon: 'ℹ️' },
      { href: '/admin/company-pages', label: 'Kurumsal Sayfalar', icon: '🏢' },
      { href: '/admin/banners', label: 'Bannerlar', icon: '🖼️' },
    ]
  },
  {
    group: 'Hizmetler & Sektörler',
    items: [
      { href: '/admin/services', label: 'Hizmetler', icon: '⚙️' },
      { href: '/admin/sectors', label: 'Sektörler', icon: '🏭' },
      { href: '/admin/representatives', label: 'Temsilcilikler', icon: '🤝' },
    ]
  },
  {
    group: 'İçerik Yönetimi',
    items: [
      { href: '/admin/blog', label: 'Blog Yazıları', icon: '📰' },
      { href: '/admin/references', label: 'Portfolyo', icon: '⭐' },
      { href: '/admin/team', label: 'Ekip Üyeleri', icon: '👥' },
      { href: '/admin/testimonials', label: 'Müşteri Yorumları', icon: '💬' },
    ]
  },
  {
    group: 'Sistem',
    items: [
      { href: '/admin/settings', label: 'Site Ayarları', icon: '⚙️' },
      { href: '/admin/leads', label: 'Talepler', icon: '📧', badge: 'Yeni' },
      { href: '/admin/users', label: 'Kullanıcılar', icon: '👤' },
    ]
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">AD</div>
          <div>
            <div style={{ fontSize: '1.125rem', lineHeight: '1.2' }}>Alp Dinamik</div>
            <div className="admin-sidebar-subtitle">Admin Panel</div>
          </div>
        </div>
      </div>
      <nav className="admin-sidebar-nav">
        {menuItems.map((group) => (
          <div key={group.group} className="admin-sidebar-nav-group">
            <div className="admin-sidebar-nav-group-label">{group.group}</div>
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="admin-sidebar-nav-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="admin-sidebar-nav-item-badge">{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
