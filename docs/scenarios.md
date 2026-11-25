# Kịch bản (Scenarios) – Quản lý thiết bị & bảo trì

## Quy ước chung

- **Người dùng:** `manager`, `tech-a`, `tech-b`
- **Dữ liệu:** thiết bị TB-001, TB-002...; phiếu P001, P002...
- **Màn hình:** W = Web, D = Desktop, M = Mobile (xem `screens.md`)
- **Luồng trạng thái:** `assigned → in_progress → submitted → approved`; trả lại: `submitted → in_progress` (bắt buộc có lý do)
- **Nguyên tắc:** QR chỉ xác định thiết bị, không cấp quyền và không tự đổi trạng thái. Chỉ thao tác rõ ràng + server xác nhận mới đổi trạng thái.

---

## SC01 · Tạo thiết bị và giao phiếu

**Đường đi:** W01 → W03 → W04 → W05 → W07

| # | Ai | Màn | Việc làm | Kết quả |
|---|----|-----|----------|---------|
| 1 | manager | W01 | Đăng nhập | Vào web theo quyền manager |
| 2 | manager | W03, W04 | Tạo thiết bị TB-001, mở chi tiết, tải QR | Có thiết bị + QR (QR chỉ chứa mã/ID thiết bị). Chưa có phiếu |
| 3 | manager | W05 | Chọn TB-001, tech-a, hạn; bấm lưu | Tạo P001, status `assigned` |
| 4 | manager | W07 | Xem phiếu vừa tạo | Có 1 event "tạo phiếu", actor = manager |

**Kiểm tra:**
- Thiếu kỹ thuật viên hoặc hạn → báo lỗi tại ô nhập, không lưu.
- tech-a thấy P001 ở M02; tech-b không thấy.

---

## SC02 · Kỹ thuật viên thực hiện và nộp phiếu

**Đường đi:** M01 → M02 → M03 → M04 → M05 → M06 → M07 → M08

| # | Ai | Màn | Việc làm | Kết quả |
|---|----|-----|----------|---------|
| 1 | tech-a | M01, M02 | Đăng nhập, chọn P001 | Chỉ thấy phiếu của mình |
| 2 | tech-a | M03 | Quét QR TB-001 | QR đúng thì sang M04 (không đổi trạng thái) |
| 3 | tech-a | M04 | Bấm **Bắt đầu** | `assigned → in_progress`, có event |
| 4 | tech-a | M05 | Chụp ảnh bằng camera Android thật | Xem lại được ảnh |
| 5 | tech-a | M06 | Xem kết quả độ sáng (C++/JNI) | Ảnh tối → cảnh báo, cho **Chụp lại** hoặc **Giữ ảnh** |
| 6 | tech-a | M07 | Gửi ảnh, nộp phiếu | Upload xong server xác nhận thì mới nộp: `in_progress → submitted` |
| 7 | tech-a | M08 | Xem kết quả | Hiện `submitted`, event đúng người |

**Kiểm tra:**
- QR của thiết bị khác → báo lệch, không gắn vào P001.
- Ảnh tối chỉ là cảnh báo, không kết luận thiết bị hỏng.
- Không dùng ảnh gắn sẵn thay camera thật.

---

## SC03 · Quản lý duyệt và đồng bộ ba app

**Đường đi:** D01 → D02 → D03 → W06 → W07 → M08

| # | Ai | Màn | Việc làm | Kết quả |
|---|----|-----|----------|---------|
| 1 | manager | D01, D02 | Đăng nhập desktop, mở hàng chờ duyệt | Thấy P001 (submitted) |
| 2 | manager | D03 | Xem ảnh, nội dung, lịch sử | Ảnh tải được qua API có đăng nhập |
| 3 | manager | D03 | Bấm **Duyệt** | `submitted → approved`, đúng 1 event, actor = manager |
| 4 | manager / tech-a | W06, W07, M08 | Làm mới | Cả ba nơi hiện `approved`, cùng ảnh, cùng lịch sử |

**Kiểm tra:**
- Bấm duyệt hai lần hoặc dùng dữ liệu cũ → không tạo thêm lần duyệt.

---

## SC04 · Trả lại và làm bổ sung

**Đường đi:** D03 → M08 → M04 → M05 → M07

| # | Ai | Màn | Việc làm | Kết quả |
|---|----|-----|----------|---------|
| 1 | manager | D03 | Bấm **Trả lại** + nhập lý do | `submitted → in_progress`. Lý do rỗng → không cho |
| 2 | tech-a | M08, M04 | Xem lý do bị trả | Thấy lý do |
| 3 | tech-a | M05, M07 | Chụp thêm, gửi lại, nộp lại | `in_progress → submitted` |
| 4 | manager | D03 | Duyệt | `approved` |

**Kiểm tra:**
- Giữ lịch sử và ảnh cũ; không tạo phiếu mới, không xóa event.

---

## SC05 · Mất mạng, hết phiên, thử lại

**Đường đi:** M05 → M07 → M08 → W01 → D01

| # | Tình huống | Kết quả mong đợi |
|---|------------|------------------|
| 1 | Mất mạng lúc gửi ở M07 | **Không** báo "đã nộp"; giữ ảnh/ghi chú; có nút **Thử lại** |
| 2 | Có mạng lại, bấm Thử lại | Gửi được, không trùng ảnh/event |
| 3 | Token hết hạn | Đăng nhập lại rồi gửi tiếp được |
| 4 | Server đã lưu nhưng app không nhận phản hồi | Kiểm tra lại trạng thái, không gửi trùng vô hạn |

*Ngoài phạm vi: tự động đồng bộ offline chạy nền.*

---

## SC06 · Sai quyền và QR sai

**Đường đi:** M03 → M04 → W07 → D03

| # | Tình huống | Kết quả mong đợi |
|---|------------|------------------|
| 1 | tech-b nhập thẳng ID của P001 | Server trả 403/404; không thấy ảnh/lịch sử |
| 2 | tech-a đang làm P001 (TB-001) nhưng quét QR TB-002 | Báo lệch thiết bị; không tự start/submit |
| 3 | Technician gọi lệnh duyệt, hoặc tự sửa role trong request | Server từ chối |
| 4 | Chưa đăng nhập mà gọi API | Server trả 401 |

*Ẩn nút trên giao diện chưa phải bảo mật; server phải tự kiểm tra.*

---

## Ngoài phạm vi vòng đầu

- **SC07 – Chatbot/MCP:** làm sau khi ba app chạy xuyên suốt.
- Offline sync nền, thanh toán, multi-tenant, kho linh kiện.

---

## Ghi bằng chứng cho mỗi kịch bản

| Mục | Nội dung cần ghi |
|-----|------------------|
| User | manager / tech-a / tech-b |
| Dữ liệu đầu vào | Thiết bị, phiếu, ảnh |
| Screen ID | Các màn đã đi qua |
| Trạng thái | Trước → sau |
| Response / event | Kết quả API, event, actor, thời điểm |
| Bằng chứng | Ảnh chụp, log, video (đã che dữ liệu nhạy cảm) |
