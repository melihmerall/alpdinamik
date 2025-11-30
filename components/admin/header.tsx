"use client"
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  user: {
    userId: string
    email: string
    role: string
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  const getRoleLabel = (role: string) => {
    return role === 'ADMIN' ? 'Yönetici' : 'Editör'
  }

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1 className="admin-header-title">Yönetim Paneli</h1>
      </div>
      <div className="admin-header-right">
        <div className="admin-header-user">
          <div className="admin-header-user-avatar">
            {getUserInitials(user.email)}
          </div>
          <div className="admin-header-user-info">
            <div className="admin-header-user-name">{user.email}</div>
            <div className="admin-header-user-role">{getRoleLabel(user.role)}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="admin-btn admin-btn-danger admin-btn-sm"
        >
          <span>Çıkış</span>
        </button>
      </div>
    </header>
  )
}
