1. Quản lý giao việc
- Quản lý tạo được thiết bị và tải được mã QR
- Quản lý giao được phiếu cho kỹ thuật viên; thiếu người nhận hoặc hạn thì báo lỗi, không lưu
- Phiếu mới có trạng thái assigned và có 1 event ghi đúng người tạo

2. Kỹ thuật viên làm việc
- Kỹ thuật viên được giao thấy phiếu của mình trên điện thoại
- Quét QR đúng thiết bị thì đi tiếp; QR sai thì báo lệch, không gắn vào phiếu
- Chụp được ảnh thật bằng camera Android thật (không dùng ảnh gắn sẵn)
- Gửi ảnh và nộp phiếu thành công thì phiếu thành submitted
- Mất mạng khi gửi thì không báo "đã nộp", giữ ảnh và có nút Thử lại

3. Quản lý duyệt
- Desktop hiện phiếu submitted, xem được ảnh
- Duyệt thì phiếu thành approved, chỉ có 1 event dù bấm hai lần
- Trả lại bắt buộc có lý do; kỹ thuật viên thấy lý do và nộp lại được

4. Ba app cùng dữ liệu
- Cùng một phiếu, web, desktop và mobile hiện cùng trạng thái, cùng ảnh, cùng lịch sử

5. Quyền và bảo mật
- Kỹ thuật viên khác không xem được phiếu và ảnh của người kia (kể cả đoán đúng ID)
- Kỹ thuật viên gọi lệnh duyệt thì server từ chối
- Chưa đăng nhập thì không xem được gì

6. Điều kiện khác
- Quét QR không tự đổi trạng thái; chỉ bấm "Bắt đầu" mới chuyển sang in_progress
- Ảnh tối chỉ cảnh báo để chụp lại, không kết luận thiết bị hỏng
- Bị trả lại thì giữ lịch sử cũ, không tạo phiếu mới

- Một phiếu nộp tối đa mấy ảnh: mỗi lần nộp 1 ảnh. Phiếu bị trả lại thì chụp thêm, D03 hiển thị tất cả ảnh của phiếu, ảnh mới nhất ở trước.
- Ghi chú của kỹ thuật viên lưu ở đâu: lưu kèm lần nộp phiếu. Quản lý xem ở D03 và W07, kỹ thuật viên được giao xem ở M08.
- Ngưỡng ảnh tối: tạm chọn dưới 60 (trên thang 0–255).
- Kỹ thuật viên đăng xuất Android: thêm một nút "Đăng xuất" nhỏ ở M02.
- Phiếu in_progress vào M04 bằng đường nào: vẫn chọn phiếu ở M02 rồi quét QR như thường. Riêng phiếu bị trả lại thì đi từ M08 vào M04.
- App biết phiếu bị trả lại bằng cách nào: phiếu đang in_progress mà sự kiện gần nhất là "trả lại" thì app hiện banner kèm lý do. Không cần cờ riêng.
- Khoảng ngày báo cáo D05: lọc theo ngày tạo phiếu.
- Nhập CSV cho nhập một phần khi còn dòng lỗi không: còn dòng lỗi thì không nhập gì cả. Dung lượng tối đa file để tạm là 5 MB.
- Đổi địa chỉ API (D06): Bắt đăng nhập lại, vì token cũ là của máy chủ cũ.
- W03: vòng đầu chỉ tạo, chưa cho sửa thiết bị

7. Thứ chưa rõ, ngoài phạm vi
- Chatbot/MCP, offline sync nền, thanh toán, multi-tenant
- Cách lưu ảnh và token an toàn
- Hết phiên giữa lúc đang gửi ảnh thì xử lý thế nào