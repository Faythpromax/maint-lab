// Dữ liệu mock trong bộ nhớ (mất khi tải lại trang) — thay bằng API thật sau này.

export type Role = 'manager' | 'technician'
export type User = { id: string; email: string; name: string; role: Role }
export type Device = { code: string; name: string; location: string }
export type Ticket = {
  id: string
  deviceCode: string
  assigneeId: string
  dueAt: string
  note: string
  status: 'assigned' | 'in_progress' | 'submitted' | 'approved'
}
export type TicketEvent = { ticketId: string; actor: string; action: string; at: string }

// Tài khoản demo (mật khẩu chỉ dùng cho mock)
export const users: (User & { password: string })[] = [
  { id: 'manager', email: 'manager@demo.vn', password: '123456', name: 'Quản lý', role: 'manager' },
  { id: 'tech-a', email: 'tech-a@demo.vn', password: '123456', name: 'Nguyễn Văn A - Đội Cơ điện', role: 'technician' },
  { id: 'tech-b', email: 'tech-b@demo.vn', password: '123456', name: 'Trần Văn B - Đội Tự động hóa', role: 'technician' },
]

export const devices: Device[] = [
  { code: 'TB-001', name: 'Máy bơm nước chính', location: 'Khu A - Tầng hầm kỹ thuật' },
  { code: 'TB-002', name: 'Máy nén khí trung tâm', location: 'Khu B - Phòng phụ trợ 02' },
  { code: 'TB-003', name: 'Tủ điện phân phối B2', location: 'Khu C - Trạm biến áp ngoài trời' },
  { code: 'TB-004', name: 'Quạt thông gió xưởng 1', location: 'Khu D - Mái xưởng sản xuất 1' },
  { code: 'TB-005', name: 'Băng tải phân loại hàng', location: 'Khu E - Kho logistics thành phẩm' },
  { code: 'TB-006', name: 'Máy phát điện dự phòng 250kVA', location: 'Khu F - Nhà đặt máy phát độc lập' },
]

// Bắt đầu rỗng để phiếu đầu tiên tạo ra là P001 (kịch bản SC01)
export const tickets: Ticket[] = []
export const events: TicketEvent[] = []
