import { redirect } from 'next/navigation'
import { verifyAuth } from '@/lib/middleware'
import AdminSidebar from '@/components/admin/sidebar'
import AdminHeader from '@/components/admin/header'
import './admin.css'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await verifyAuth()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader user={user} />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  )
}

