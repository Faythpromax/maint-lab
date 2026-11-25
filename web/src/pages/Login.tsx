import { useState } from 'react'
import { ApiError, login } from '../mock/api'
import type { User } from '../mock/data'

type Status = 'idle' | 'loading' | 'credentials' | 'network'

// W01: form đăng nhập + các trạng thái (loading, sai thông tin, mất kết nối, hết phiên)
export default function Login({ onSignIn, expired }: { onSignIn: (u: User) => void; expired: boolean }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const loading = status === 'loading'

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (loading) return
    setStatus('loading')
    try {
      onSignIn(await login(email, password))
    } catch (err) {
      // Sai thông tin: giữ email, xóa mật khẩu. Lỗi khác: coi như mất kết nối
      if (err instanceof ApiError && err.kind === 'credentials') setPassword('')
      setStatus(err instanceof ApiError && err.kind === 'credentials' ? 'credentials' : 'network')
    }
  }

  return (
    <div className="center">
      <form className="card login" onSubmit={submit}>
        <h1 style={{ textAlign: 'center', margin: 0 }}>MaintenanceLab</h1>
        <p className="muted" style={{ textAlign: 'center' }}>Hệ thống Quản lý Thiết bị &amp; Bảo trì</p>

        {/* Banner theo trạng thái */}
        {expired && status === 'idle' && <div className="banner warn">Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.</div>}
        {status === 'credentials' && <div className="banner">Email hoặc mật khẩu không chính xác</div>}
        {status === 'network' && (
          <div className="banner">
            Không kết nối được tới máy chủ
            <button type="button" className="btn" onClick={() => submit()}>Thử lại</button>
          </div>
        )}

        <label>Email đăng nhập *</label>
        <input type="email" placeholder="Nhập email" value={email} disabled={loading} onChange={(e) => setEmail(e.target.value)} />
        <label>Mật khẩu *</label>
        <input type="password" placeholder="Nhập mật khẩu" value={password} disabled={loading} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn primary full" disabled={loading}>
          {loading ? <><span className="spin" />Đang đăng nhập...</> : 'Đăng nhập'}
        </button>
        <p className="muted">Demo: manager@demo.vn / tech-a@demo.vn — mật khẩu 123456</p>
      </form>
    </div>
  )
}
