import { useEffect, useState } from 'react'
import './App.css'
import type { User } from './mock/data'
import Layout from './components/Layout'
import Login from './pages/Login'
import Devices from './pages/Devices'
import NewTicket from './pages/NewTicket'

const KEY = 'session'
const load = (): User | null => {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? 'null') } catch { return null }
}

// Router tối giản theo location.hash: #/login, #/devices, #/tickets/new?device=TB-001
const go = (path: string) => { location.hash = path }

export default function App() {
  const [user, setUser] = useState<User | null>(load)
  const [path, setPath] = useState(() => location.hash.slice(1) || '/login')

  useEffect(() => {
    const on = () => setPath(location.hash.slice(1) || '/login')
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])

  const signIn = (u: User) => {
    sessionStorage.setItem(KEY, JSON.stringify(u))
    setUser(u)
    go(u.role === 'manager' ? '/overview' : '/tickets') // W02 / W06
  }
  const signOut = () => { sessionStorage.removeItem(KEY); setUser(null); go('/login') }

  // Chưa đăng nhập → W01. Hết phiên giữa chừng cũng quay về W01 kèm thông báo
  if (!user) return <Login onSignIn={signIn} expired={path === '/login?expired'} />
  if (path.startsWith('/login')) { go(user.role === 'manager' ? '/overview' : '/tickets'); return null }

  const [route, query] = path.split('?')
  const expire = () => { sessionStorage.removeItem(KEY); setUser(null); go('/login?expired') }

  // W03 và W05 chỉ dành cho quản lý
  let page
  if (user.role === 'manager' && route === '/devices') page = <Devices />
  else if (user.role === 'manager' && route === '/tickets/new')
    page = <NewTicket user={user} device={new URLSearchParams(query).get('device') ?? ''} onExpire={expire} />
  else page = <Placeholder route={route} role={user.role} />

  return <Layout user={user} route={route} onSignOut={signOut}>{page}</Layout>
}

// Các màn chưa làm (W02, W04, W06, W07...) hiện khung tạm
function Placeholder({ route, role }: { route: string; role: User['role'] }) {
  const denied = role !== 'manager' && (route === '/devices' || route === '/tickets/new')
  return (
    <div className="card empty">
      <h2>{denied ? 'Không có quyền truy cập' : 'Màn hình chưa làm'}</h2>
      <p className="muted">{denied ? 'Chỉ quản lý được dùng màn hình này.' : `Đường dẫn: ${route}`}</p>
    </div>
  )
}
