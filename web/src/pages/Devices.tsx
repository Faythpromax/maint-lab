import { useEffect, useState } from 'react'
import { ApiError, createDevice, listDevices } from '../mock/api'
import type { Device } from '../mock/data'

type Errors = { code?: string; name?: string; form?: string }

// W03: danh sách thiết bị — tải, tìm kiếm, thêm mới (không sửa ở vòng đầu)
export default function Devices() {
  const [list, setList] = useState<Device[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)

  const fetchList = () => listDevices().then(setList, () => setFailed(true))
  const retry = () => { setList(null); setFailed(false); fetchList() }
  useEffect(() => { fetchList() }, [])

  const needle = q.trim().toLowerCase()
  const shown = list?.filter((d) => `${d.code} ${d.name} ${d.location}`.toLowerCase().includes(needle))

  return (
    <>
      <div className="row">
        <div>
          <div className="crumb">Hệ thống / Thiết bị</div>
          <h1>Danh sách thiết bị</h1>
          <p className="muted">Quản lý thông tin thiết bị, in mã QR và điều phối phiếu kiểm tra định kỳ.</p>
        </div>
        <button className="btn primary" disabled={!list} onClick={() => setAdding(true)}>+ Thêm thiết bị</button>
      </div>

      {/* Ô tìm kiếm (mã / tên / vị trí) */}
      <div className="card row" style={{ marginTop: 16, padding: 16 }}>
        <input style={{ maxWidth: 480 }} placeholder="Tìm kiếm theo mã, tên hoặc vị trí thiết bị..."
          value={q} disabled={!list} onChange={(e) => setQ(e.target.value)} />
        <span className="muted">Tổng số: <strong>{list?.length ?? 0}</strong> thiết bị</span>
      </div>

      {/* Nội dung chính theo trạng thái: lỗi API / đang tải / rỗng / không kết quả / bảng */}
      {failed ? (
        <div className="card empty">
          <h3>Không thể tải danh sách thiết bị</h3>
          <p className="muted">Không kết nối được máy chủ. Vui lòng thử lại.</p>
          <button className="btn primary" onClick={retry}>Thử lại</button>
        </div>
      ) : !shown ? (
        <div className="card table">
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ padding: 20 }}><div className="skel" /></div>)}
        </div>
      ) : list!.length === 0 ? (
        <div className="card empty">
          <h3>Chưa có thiết bị nào trong hệ thống</h3>
          <p className="muted">Hãy thêm thiết bị đầu tiên để tạo mã QR và giao phiếu.</p>
          <button className="btn primary" onClick={() => setAdding(true)}>Thêm thiết bị ngay</button>
        </div>
      ) : shown.length === 0 ? (
        <div className="card empty">
          <h3>Không có kết quả</h3>
          <p className="muted">Không có thiết bị khớp “{q}”. Thử từ khóa khác.</p>
        </div>
      ) : (
        <div className="card table">
          <table>
            <thead><tr><th>Mã thiết bị</th><th>Tên thiết bị</th><th>Vị trí</th><th /></tr></thead>
            <tbody>
              {shown.map((d) => (
                <tr key={d.code} onClick={() => (location.hash = `/devices/${d.code}`)}>
                  <td><strong>{d.code}</strong></td><td>{d.name}</td><td>{d.location}</td><td>Chi tiết →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adding && (
        <AddDevice
          onClose={() => setAdding(false)}
          onSaved={(d) => { setList((l) => [...(l ?? []), d]); setAdding(false) }}
        />
      )}
    </>
  )
}

// Modal thêm thiết bị: kiểm tra mã/tên → gọi API → lỗi hiện ngay tại ô, giữ nguyên dữ liệu
function AddDevice({ onClose, onSaved }: { onClose: () => void; onSaved: (d: Device) => void }) {
  const [f, setF] = useState<Device>({ code: '', name: '', location: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const set = (k: keyof Device) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    const next: Errors = {}
    if (!f.code.trim()) next.code = 'Vui lòng nhập mã thiết bị.'
    if (!f.name.trim()) next.name = 'Vui lòng nhập tên thiết bị. Tên không được để trống.'
    setErrors(next)
    if (next.code || next.name) return

    setSaving(true)
    try {
      onSaved(await createDevice({ code: f.code.trim(), name: f.name.trim(), location: f.location.trim() }))
    } catch (err) {
      const duplicate = err instanceof ApiError && err.kind === 'duplicate'
      setErrors(duplicate ? { code: `Mã thiết bị “${f.code.trim()}” đã được sử dụng. Vui lòng chọn mã khác.` } : { form: 'Không thể lưu thiết bị. Kiểm tra kết nối rồi thử lại.' })
      setSaving(false)
    }
  }

  return (
    <div className="overlay">
      <form className="card modal" onSubmit={save}>
        <h2 style={{ margin: 0 }}>Thêm thiết bị mới</h2>
        {errors.form && <div className="banner">{errors.form}</div>}

        <label>Mã thiết bị *</label>
        <input className={errors.code ? 'bad' : ''} placeholder="TB-007" value={f.code} disabled={saving} onChange={set('code')} />
        {errors.code && <div className="err">{errors.code}</div>}

        <label>Tên thiết bị *</label>
        <input className={errors.name ? 'bad' : ''} placeholder="Ví dụ: Máy tiện CNC 3 trục" value={f.name} disabled={saving} onChange={set('name')} />
        {errors.name && <div className="err">{errors.name}</div>}

        <label>Vị trí lắp đặt (tùy chọn)</label>
        <input value={f.location} disabled={saving} onChange={set('location')} />

        <div className="actions">
          <button type="button" className="btn" disabled={saving} onClick={onClose}>Hủy bỏ</button>
          <button className="btn primary" disabled={saving}>
            {saving ? <><span className="spin" />Đang lưu thiết bị...</> : 'Lưu thiết bị'}
          </button>
        </div>
      </form>
    </div>
  )
}
