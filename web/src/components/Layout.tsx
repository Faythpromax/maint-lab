import type { ReactNode } from 'react'
import type { User } from '../mock/data'

// Khung chung: sidebar (menu + người dùng) và vùng nội dung
export default function Layout({ user, route, onSignOut, children }: {
  user: User; route: string; onSignOut: () => void; children: ReactNode
}) {
  const link = (href: string, label: string, on: boolean) => (
    <a href={`#${href}`} className={on ? 'on' : ''}>{label}</a>
  )
  return (
    <div className="shell">
      <aside className="side">
        <nav>
          <div className="brand">MaintenanceLab<small>Hệ thống Bảo trì &amp; Thiết bị</small></div>
          {link('/overview', 'Tổng quan (W02)', route === '/overview')}
          {link('/devices', 'Thiết bị (W03)', route === '/devices')}
          {link('/tickets', 'Phiếu kiểm tra (W06)', route.startsWith('/tickets'))}
        </nav>
        <div>
          <strong style={{ color: '#fff' }}>{user.email}</strong>
          <small>Vai trò: {user.role === 'manager' ? 'Quản lý' : 'Kỹ thuật viên'}</small>
          <a href="#/login" onClick={onSignOut} style={{ padding: 0, marginTop: 8 }}>Đăng xuất</a>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}
