import { devices, events, tickets, users } from './data'
import type { Device, Role, Ticket, User } from './data'

export type ApiErrorKind = 'network' | 'session' | 'forbidden' | 'credentials' | 'duplicate'
export class ApiError extends Error {
  kind: ApiErrorKind
  constructor(kind: ApiErrorKind) {
    super(kind)
    this.kind = kind
  }
}

// Giả lập độ trễ mạng; thêm ?fail=network|session vào URL để ép lỗi khi demo các trạng thái
async function call() {
  await new Promise((r) => setTimeout(r, 600))
  const fail = new URLSearchParams(location.search).get('fail')
  if (fail === 'network' || fail === 'session') throw new ApiError(fail)
}

export async function login(email: string, password: string): Promise<User> {
  await call()
  const u = users.find((x) => x.email === email.trim() && x.password === password)
  if (!u) throw new ApiError('credentials')
  return { id: u.id, email: u.email, name: u.name, role: u.role }
}

export const technicians = () => users.filter((u) => u.role === 'technician')

export async function listDevices(): Promise<Device[]> {
  await call()
  return [...devices]
}

export async function createDevice(d: Device): Promise<Device> {
  await call()
  if (devices.some((x) => x.code.toLowerCase() === d.code.toLowerCase())) throw new ApiError('duplicate')
  devices.push(d)
  return d
}

// Server tự kiểm tra quyền: chỉ manager mới tạo được phiếu
export async function createTicket(
  actor: { id: string; role: Role },
  t: Pick<Ticket, 'deviceCode' | 'assigneeId' | 'dueAt' | 'note'>,
): Promise<Ticket> {
  await call()
  if (actor.role !== 'manager') throw new ApiError('forbidden')
  const ticket: Ticket = { ...t, id: `P${String(tickets.length + 1).padStart(3, '0')}`, status: 'assigned' }
  tickets.push(ticket)
  events.push({ ticketId: ticket.id, actor: actor.id, action: 'tạo phiếu', at: new Date().toISOString() })
  return ticket
}
