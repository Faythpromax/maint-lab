import { useEffect, useState } from 'react'
import { ApiError, createTicket, listDevices, technicians } from '../mock/api'
import type { Device, Ticket, User } from '../mock/data'

type Errors = { assigneeId?: string; dueAt?: string }

// W05: tạo & giao phiếu — kiểm tra ô nhập → gọi API → chỉ báo thành công khi "server" xác nhận
export default function NewTicket({ user, device, onExpire }: { user: User; device: string; onExpire: () => void }) {
  const [devices, setDevices] = useState<Device[]>([])
  const [f, setF] = useState({ deviceCode: device, assigneeId: '', dueAt: '', note: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [done, setDone] = useState<Ticket | null>(null)

  useEffect(() => {
    listDevices().then((d) => {
      setDevices(d)
      setF((x) => ({ ...x, deviceCode: x.deviceCode || d[0]?.code || '' }))
    }, () => setApiError('Không tải được danh sách thiết bị. Kiểm tra kết nối rồi thử lại.'))
  }, [])

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value })

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (saving) return
    const next: Errors = {}
    if (!f.assigneeId) next.assigneeId = 'Vui lòng chọn kỹ thuật viên được giao thực hiện phiếu.'
    if (!f.dueAt) next.dueAt = 'Vui lòng đặt hạn hoàn thành cho phiếu kiểm tra.'
    else if (Number.isNaN(Date.parse(f.dueAt)) || Date.parse(f.dueAt) < Date.now()) next.dueAt = 'Hạn hoàn thành không hợp lệ (phải sau thời điểm hiện tại).'
    setErrors(next)
    if (next.assigneeId || next.dueAt) return

    setSaving(true); setApiError('')
    try {
      setDone(await createTicket(user, f))
    } catch (err) {
      const kind = err instanceof ApiError ? err.kind : 'network'
      if (kind === 'session') return onExpire()
      setApiError(kind === 'forbidden' ? 'Bạn không có quyền tạo phiếu.' : 'Không thể lưu phiếu. Kiểm tra kết nối rồi thử lại.')
      setSaving(false)
    }
  }

  // Thành công: hiện mã phiếu/trạng thái mới rồi sang W07
  if (done) {
    return (
      <div className="card empty">
        <div className="banner ok" style={{ justifyContent: 'center' }}>Đã giao phiếu {done.id}</div>
        <p className="muted">Máy chủ đã xác nhận lưu phiếu. Trạng thái: <strong>{done.status}</strong></p>
        <a className="btn primary" href={`#/tickets/${done.id}`}>Xem chi tiết phiếu (W07)</a>
      </div>
    )
  }

  const cls = (bad?: string) => (bad ? 'bad' : '')
  return (
    <>
      <div className="crumb">Phiếu kiểm tra / Tạo và giao phiếu mới</div>
      <h1>Tạo và giao phiếu</h1>
      <p className="muted">Phân công kỹ thuật viên thực hiện kiểm tra và bảo trì định kỳ cho thiết bị.</p>

      <form className="card" style={{ maxWidth: 640 }} onSubmit={submit}>
        {apiError && (
          <div className="banner">
            {apiError}
            <button type="button" className="btn" onClick={() => submit()}>Thử lại</button>
          </div>
        )}

        <label style={{ marginTop: 0 }}>Thiết bị *</label>
        <select value={f.deviceCode} disabled={saving} onChange={set('deviceCode')}>
          {devices.map((d) => <option key={d.code} value={d.code}>{d.code} - {d.name}</option>)}
        </select>

        <label>Kỹ thuật viên thực hiện *</label>
        <select className={cls(errors.assigneeId)} value={f.assigneeId} disabled={saving} onChange={set('assigneeId')}>
          <option value="">-- Chọn kỹ thuật viên phụ trách --</option>
          {technicians().map((t) => <option key={t.id} value={t.id}>{t.id} ({t.name})</option>)}
        </select>
        {errors.assigneeId && <div className="err">{errors.assigneeId}</div>}

        <label>Hạn hoàn thành (due_at) *</label>
        <input type="datetime-local" className={cls(errors.dueAt)} value={f.dueAt} disabled={saving} onChange={set('dueAt')} />
        {errors.dueAt && <div className="err">{errors.dueAt}</div>}

        <label>Ghi chú hướng dẫn (không bắt buộc)</label>
        <textarea rows={3} value={f.note} disabled={saving} onChange={set('note')} />

        <div className="actions">
          <button type="button" className="btn" disabled={saving} onClick={() => history.back()}>Hủy</button>
          <button className="btn primary" disabled={saving}>
            {saving ? <><span className="spin" />Đang lưu...</> : 'Lưu và giao'}
          </button>
        </div>
      </form>
    </>
  )
}
