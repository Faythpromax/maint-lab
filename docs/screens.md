W01: Đăng nhập
- Người dùng: Quản lý, kỹ thuật viên
- Mục tiêu: Xác thực người dùng và đưa về đúng màn theo quyền (W02 nếu là quản lý, W06 nếu là kỹ thuật viên)
- Dữ liệu vào: Email, mật khẩu
- Nút chính: Đăng nhập
- Màn đi tới: Quản lý tới W02, kỹ thuật viên tới W06
- Trạng thái:
+ Loading: Đang gửi thông tin đăng nhập thì không cho bấm lại nút đăng nhập
+ Rỗng: Không áp dụng
+ Lỗi đăng nhập: Sai email/mật khẩu thì báo tại form, giữ nguyên email đã nhập
+ Lỗi kết nối: Mất mạng hoặc server không trả lời thì thông báo không kết nối được kèm nút thử lại
+ Hết phiên đăng nhập từ màn khác về: Hiện thông báo hết phiên và cần đăng nhập lại
- Điều kiện được thao tác: Quản lý/kỹ thuật viên có tài khoản hợp lệ

W02: Tổng quan công việc
- Người dùng: Quản lý
- Mục tiêu: Nhìn nhanh tình hình công việc: bao nhiêu phiếu đã giao (assigned), đang thực hiện (in_progress), chờ duyệt (submitted), hoàn tất (approved)
- Dữ liệu vào: Không có. Các con số lấy từ API danh sách phiếu, không tự tính hay tạo số liệu riêng
- Nút chính: Bấm vào từng con số để lọc danh sách phiếu
- Màn đi tới: W06 (đã lọc sẵn theo con số vừa bấm); menu tới W03
- Trạng thái:
+ Loading: Hiện icon loading hoặc khung chờ cho các con số
+ Rỗng: Chưa có phiếu nào thì hiện hướng dẫn "Tạo thiết bị rồi giao phiếu" kèm nút tới W03
+ Lỗi API: Báo không tải được số liệu kèm nút thử lại
+ Hết phiên: Báo hết phiên và đưa về W01
- Điều kiện được thao tác: Chỉ quản lý

W03: Danh sách thiết bị
- Người dùng: Quản lý
- Mục tiêu: Xem, tìm, tạo và sửa cơ bản các thiết bị
- Dữ liệu vào: Ô tìm kiếm (mã/tên/vị trí). Form tạo/sửa: mã thiết bị, tên, vị trí
- Nút chính: Thêm thiết bị; Lưu
- Màn đi tới: Bấm một thiết bị mở W04
- Trạng thái:
+ Loading: Đang tải danh sách; khi lưu thì khóa nút Lưu để không bấm hai lần
+ Rỗng: Chưa có thiết bị thì hiện nút "Thêm thiết bị"; tìm không thấy thì báo "Không có kết quả"
+ Lỗi nhập liệu: Thiếu tên, hoặc mã thiết bị bị trùng thì báo ngay tại ô đó, giữ nguyên dữ liệu đã nhập
+ Lỗi API: Báo lỗi kèm nút thử lại
- Điều kiện được thao tác: Chỉ quản lý

W04: Chi tiết thiết bị & QR
- Người dùng: Quản lý
- Mục tiêu: Xem thông tin một thiết bị, tải mã QR để in dán lên máy, và đi tới giao phiếu
- Dữ liệu vào: Mã, tên, vị trí, mã QR, lịch sử các phiếu của thiết bị này
- Nút chính: Tải QR; Tạo phiếu cho thiết bị này
- Màn đi tới: W05 (tạo phiếu, đã chọn sẵn thiết bị); bấm một phiếu trong lịch sử mở W07
- Trạng thái:
+ Loading: Đang tải thông tin thiết bị
+ Rỗng: Thiết bị chưa có phiếu nào thì hiện "Chưa có phiếu" kèm nút tạo phiếu
+ Lỗi: Thiết bị không tồn tại hoặc không tải được thì báo rõ và có đường quay về W03
- Điều kiện được thao tác: Chỉ quản lý
- Ghi chú: QR chỉ chứa mã thiết bị, không chứa token hay quyền. Tạo QR không có nghĩa là đã tạo phiếu

W05: Tạo và giao phiếu
- Người dùng: Quản lý
- Mục tiêu: Giao một phiếu kiểm tra thiết bị cho một kỹ thuật viên
- Dữ liệu vào: Thiết bị, kỹ thuật viên, hạn hoàn thành (due_at), ghi chú
- Nút chính: Lưu và giao
- Màn đi tới: W07 (chi tiết phiếu vừa tạo)
- Trạng thái:
+ Loading: Đang lưu thì khóa nút, không cho bấm hai lần
+ Lỗi nhập liệu: Thiếu kỹ thuật viên hoặc hạn, hoặc hạn không hợp lệ thì báo ngay tại ô đó, giữ nguyên dữ liệu đã nhập
+ Lỗi API: Báo lỗi kèm nút thử lại; phân biệt mất mạng, hết phiên, không đủ quyền
+ Thành công: Chỉ báo thành công khi server xác nhận, rồi chuyển sang W07 và hiện mã phiếu/trạng thái mới
- Điều kiện được thao tác: Chỉ quản lý. Server kiểm lại quyền, không chỉ ẩn nút trên giao diện

W06: Danh sách phiếu
- Người dùng: Quản lý và kỹ thuật viên, theo quyền
- Mục tiêu: Xem và lọc danh sách phiếu
- Dữ liệu vào: Bộ lọc: trạng thái, người nhận, quá hạn (kỹ thuật viên không có lọc người nhận vì chỉ thấy phiếu mình)
- Nút chính: Lọc; bấm một phiếu để mở chi tiết
- Màn đi tới: W07
- Trạng thái:
+ Loading: Đang tải danh sách
+ Rỗng: Không có phiếu khớp bộ lọc thì báo rõ và gợi ý bỏ lọc
+ Lỗi API: Báo lỗi kèm nút thử lại; hết phiên thì về W01
- Điều kiện được thao tác: Quản lý thấy tất cả phiếu. Kỹ thuật viên chỉ thấy phiếu của mình (do server lọc, không chỉ ẩn trên giao diện)

W07: Chi tiết phiếu & lịch sử
- Người dùng: Người có quyền với phiếu đó (quản lý, hoặc kỹ thuật viên được giao)
- Mục tiêu: Theo dõi một phiếu: trạng thái, ảnh, độ sáng, lịch sử các sự kiện
- Dữ liệu vào: Trạng thái, thiết bị, người nhận, hạn, ảnh, brightness và analysis_version, danh sách event (ai, lúc nào, đổi trạng thái gì, lý do)
- Nút chính: Không có thao tác ghi. Web chủ yếu để theo dõi, việc duyệt/trả lại bắt buộc làm ở desktop (D03)
- Màn đi tới: Quay lại màn đã mở nó: W06 (từ danh sách phiếu), W04 (từ lịch sử thiết bị) hoặc W06 (sau khi vừa tạo phiếu ở W05)
- Trạng thái:
+ Loading: Đang tải chi tiết và ảnh
+ Rỗng: Chưa có ảnh thì hiện "Chưa có ảnh"
+ Không có quyền / không tồn tại: API trả 403 hoặc 404 thì chỉ báo "Không xem được phiếu này", không hiện bất kỳ ảnh hay lịch sử nào
+ Lỗi tải ảnh: Báo riêng phần ảnh kèm nút thử lại; hết phiên (401) không được hiểu là ảnh hỏng
- Điều kiện được thao tác: Chỉ người có quyền với phiếu. Kỹ thuật viên khác đoán đúng mã phiếu cũng không xem được

W08: Chatbot — phần nâng cao
- Người dùng: Mọi người đã đăng nhập
- Mục tiêu: Hỏi về thiết bị, phiếu, quy trình bằng câu hỏi tự nhiên
- Dữ liệu vào: Câu hỏi của người dùng
- Nút chính: Gửi
- Màn đi tới: W09 khi bot đề xuất một thao tác ghi (ví dụ giao phiếu)
- Trạng thái:
+ Loading: Hiện "đang xử lý" và trạng thái từng tool đang chạy
+ Rỗng: Chưa có hội thoại thì gợi ý vài câu hỏi mẫu
+ Thiếu thông tin: Câu hỏi mơ hồ hoặc không có dữ liệu thì bot hỏi lại hoặc nói không tìm thấy, không bịa
+ Lỗi: Tool lỗi, hết thời gian hoặc hết ngân sách thì báo rõ, không giả vờ thành công
- Điều kiện được thao tác: Đã đăng nhập; mỗi người chỉ thấy dữ liệu và lịch sử chat của mình, theo đúng quyền (kỹ thuật viên chỉ thấy phiếu được giao)
- Ghi chú: Làm sau cùng, khi ba app đã chạy. Có thể vẽ wireframe trước. Câu trả lời phải hiện nguồn (mã phiếu/thiết bị hoặc tài liệu)

W09: Xác nhận thao tác AI
- Người dùng: Người có quyền thực hiện thao tác đó
- Mục tiêu: Cho người dùng xem trước và tự xác nhận trước khi bot ghi dữ liệu
- Dữ liệu vào: Thiết bị, người nhận, hạn, nội dung thay đổi, mã thao tác (action ID)
- Nút chính: Xác nhận; Hủy
- Màn đi tới: Xác nhận xong về W06/W07 để xem kết quả; Hủy thì quay lại W08
- Trạng thái:
+ Chưa xác nhận: Chưa bấm Xác nhận thì không ghi gì vào phiếu
+ Hủy: Không ghi gì
+ Hết hạn / dữ liệu đã đổi: Thao tác quá hạn hoặc phiếu đã đổi (revision cũ) thì báo và không ghi
+ Xác nhận lặp: Bấm lại hoặc gửi lại thì trả về kết quả cũ, không ghi lần hai
+ Sai người: Người khác không xác nhận được thao tác này
- Điều kiện được thao tác: Chỉ đúng người đã yêu cầu thao tác, và còn quyền tại thời điểm xác nhận
- Ghi chú: Làm ở phần nâng cao. Bot không thể tự bấm xác nhận thay người dùng

D01: Đăng nhập
- Người dùng: Quản lý
- Mục tiêu: Đăng nhập app desktop bằng chính tài khoản đã dùng trên web
- Dữ liệu vào: Địa chỉ API (lấy từ cấu hình), email, mật khẩu
- Nút chính: Đăng nhập; liên kết phụ "Sửa địa chỉ API"
- Màn đi tới: D02
- Trạng thái:
+ Lỗi đăng nhập: Sai email/mật khẩu thì báo tại form, giữ nguyên email
+ Lỗi kết nối: API không trả lời thì báo rõ kèm nút thử lại và gợi ý kiểm tra địa chỉ API
+ Lỗi địa chỉ API: Địa chỉ sai định dạng thì báo ngay tại ô, giữ cấu hình cũ, không gửi đăng nhập
+ Hết phiên: Hiện thông báo hết phiên và cần đăng nhập lại
+ Loading: Đang đăng nhập thì khóa nút
+ Rỗng: Không áp dụng
- Điều kiện được thao tác: Chỉ tài khoản quản lý. Token lưu bằng kho bí mật của hệ điều hành, không ghi vào thư mục cài

D02: Hàng chờ duyệt
- Người dùng: Quản lý
- Mục tiêu: Xem các phiếu kỹ thuật viên đã nộp và đang chờ duyệt
- Dữ liệu vào: Danh sách phiếu có trạng thái submitted; ô lọc/tìm
- Nút chính: Làm mới; bấm một phiếu để xem
- Màn đi tới: D03; menu tới D04, D05, D06
- Trạng thái:
+ Loading: Đang tải danh sách
+ Rỗng: Không có phiếu chờ duyệt thì báo "Không có phiếu nào chờ duyệt"
+ Lỗi API: Báo lỗi kèm nút thử lại; app không bị đứng khi API chậm
+ Hết phiên: Về D01
- Điều kiện được thao tác: Chỉ quản lý

D03: Xem ảnh & duyệt phiếu
- Người dùng: Quản lý
- Mục tiêu: Kiểm tra ảnh và nội dung phiếu rồi duyệt hoặc trả lại
- Dữ liệu vào: Thông tin phiếu, ảnh chụp, brightness, lịch sử. Khi Trả lại phải nhập lý do
- Nút chính: Duyệt; Trả lại
- Màn đi tới: Sau khi duyệt/trả lại quay về D02
- Trạng thái:
+ Loading: Đang tải ảnh; khi gửi duyệt/trả lại thì khóa nút
+ Lỗi nhập liệu: Trả lại mà để trống lý do thì báo và không gửi
+ Xung đột (409): Phiếu đã bị đổi (revision cũ) thì báo "Phiếu đã thay đổi", tải lại dữ liệu, không ghi
+ Lỗi tải ảnh: Hết phiên (401) hiểu là hết phiên, không phải ảnh hỏng; có nút thử lại
+ Bấm lặp: Bấm Duyệt hai lần vẫn chỉ có một lần duyệt, không tạo event thứ hai
+ Thành công: Chỉ báo thành công khi server xác nhận, hiện trạng thái mới
- Điều kiện được thao tác: Chỉ quản lý, và chỉ với phiếu đang submitted. Server từ chối nếu kỹ thuật viên gọi duyệt

D04: Nhập/xuất CSV hoặc JSON
- Người dùng: Quản lý
- Mục tiêu: Nhập hàng loạt thiết bị từ file, hoặc xuất dữ liệu ra file
- Dữ liệu vào: File CSV/JSON do người dùng chọn
- Nút chính: Chọn file; Nhập; Xuất
- Màn đi tới: Quay lại D02 hoặc menu
- Trạng thái:
+ Xem trước: Hiện bảng xem trước và lỗi từng dòng (thiếu tên, mã trùng...) trước khi cho nhập
+ Loading: Đang nhập/xuất thì khóa nút, hiện tiến độ
+ Lỗi: File sai định dạng hoặc quá lớn thì báo rõ, không nhập gì
+ Rỗng: Chưa chọn file thì nút Nhập bị tắt
- Điều kiện được thao tác: Chỉ quản lý. App chỉ đọc nội dung file như dữ liệu, không bao giờ chạy nội dung file

D05: Báo cáo đơn giản
- Người dùng: Quản lý
- Mục tiêu: Xem thống kê phiếu theo trạng thái và khoảng thời gian
- Dữ liệu vào: Trạng thái, khoảng ngày
- Nút chính: Xem; Xuất CSV/JSON
- Màn đi tới: Menu / D02
- Trạng thái:
+ Loading: Đang tính/tải báo cáo
+ Rỗng: Không có phiếu trong khoảng đã chọn thì báo rõ
+ Lỗi nhập liệu: Khoảng ngày sai (ngày bắt đầu sau ngày kết thúc) thì báo tại ô
+ Lỗi API: Báo lỗi kèm nút thử lại
- Điều kiện được thao tác: Chỉ quản lý

D06: Cấu hình & phiên bản
- Người dùng: Người dùng đang đăng nhập
- Mục tiêu: Xem/sửa địa chỉ API, xem phiên bản app, đăng xuất
- Dữ liệu vào: Địa chỉ API, số phiên bản
- Nút chính: Lưu; Đăng xuất
- Màn đi tới: Đăng xuất thì về D01
- Trạng thái:
+ Lỗi nhập liệu: Địa chỉ API sai định dạng thì báo và giữ cấu hình cũ
+ Rỗng: Không áp dụng
- Điều kiện được thao tác: Mọi người dùng đã đăng nhập. Không ghi key/token vào thư mục cài đặt

M01: Đăng nhập
- Người dùng: Kỹ thuật viên
- Mục tiêu: Đăng nhập app điện thoại bằng tài khoản dùng chung với hệ thống
- Dữ liệu vào: Email, mật khẩu
- Nút chính: Đăng nhập
- Màn đi tới: M02
- Trạng thái:
+ Lỗi đăng nhập: Sai mật khẩu thì báo tại form, giữ nguyên email
+ Lỗi kết nối: Mất mạng/server không trả lời thì báo rõ kèm nút thử lại
+ Hết phiên: Hiện thông báo hết phiên và cần đăng nhập lại
+ Loading: Đang đăng nhập thì khóa nút
+ Rỗng: Không áp dụng
- Điều kiện được thao tác: Chỉ kỹ thuật viên có tài khoản. Token lưu an toàn bằng kho bí mật của điện thoại


M02: Việc được giao
- Người dùng: Kỹ thuật viên
- Mục tiêu: Xem các phiếu được giao cho mình và chọn phiếu để làm
- Dữ liệu vào: Danh sách phiếu của mình: mã phiếu, thiết bị, trạng thái, hạn; ô tìm kiếm
- Nút chính: Chọn phiếu; Quét QR
- Màn đi tới: M03 (quét QR cho phiếu đang chọn)
- Trạng thái:
+ Loading: Đang tải danh sách
+ Rỗng: Chưa có việc nào thì báo "Bạn chưa được giao phiếu nào"
+ Lỗi API: Báo lỗi kèm nút thử lại; hết phiên thì về M01
- Điều kiện được thao tác: Chỉ kỹ thuật viên, chỉ thấy phiếu của mình (kỹ thuật viên khác không thấy)

M03: Quét QR thiết bị
- Người dùng: Kỹ thuật viên
- Mục tiêu: Xác nhận đang đứng đúng thiết bị của phiếu
- Dữ liệu vào: Mã thiết bị đọc từ QR (QR chỉ chứa mã/ID thiết bị)
- Nút chính: Không có nút ghi; tự đọc khi camera thấy QR. Có nút Quay lại
- Màn đi tới: QR khớp thiết bị của phiếu thì mở M04; không khớp thì ở lại và báo
- Trạng thái:
+ Xin quyền camera: Chỉ xin quyền khi vào màn này
+ Từ chối quyền camera: Giải thích vì sao cần camera, có nút mở cài đặt và đường quay về M02
+ QR sai: Báo rõ "Lệch thiết bị" (ví dụ phiếu của TB-001 nhưng quét TB-002), không gắn gì vào phiếu
+ QR không đọc được: Báo và cho quét lại
- Điều kiện được thao tác: Chỉ với phiếu của chính mình. QR không cấp quyền, không tự bắt đầu hay nộp phiếu
- Ghi chú: Phải tắt máy quét QR trước khi mở camera chụp ảnh ở M05 để tránh tranh nhau camera

M04: Chi tiết & bắt đầu phiếu
- Người dùng: Kỹ thuật viên được giao phiếu
- Mục tiêu: Xem nội dung phiếu và chủ động bấm Bắt đầu
- Dữ liệu vào: Thiết bị, nội dung, hạn, lý do bị trả lại (nếu có)
- Nút chính: Bắt đầu (khi phiếu đang assigned); Chụp ảnh (khi đang in_progress)
- Màn đi tới: M05
- Trạng thái:
+ Loading: Khi bấm Bắt đầu thì khóa nút, không cho bấm hai lần
+ Xung đột (409): Trạng thái phiếu đã đổi thì báo và tải lại
+ Lỗi API: Báo lỗi kèm nút thử lại; chỉ báo đã bắt đầu khi server xác nhận
+ Hết phiên: Về M01
- Điều kiện được thao tác: Chỉ người được giao phiếu này. Quét QR không tự đổi trạng thái, chỉ nút Bắt đầu mới gọi start

M05: Chụp và xem lại ảnh
- Người dùng: Kỹ thuật viên được giao phiếu
- Mục tiêu: Chụp ảnh thiết bị bằng camera thật và xem lại trước khi dùng
- Dữ liệu vào: Hình ảnh từ camera
- Nút chính: Chụp; Xem lại; Dùng ảnh này
- Màn đi tới: M06 (xem kết quả đo độ sáng)
- Trạng thái:
+ Loading: Camera đang khởi động thì chưa cho bấm Chụp
+ Từ chối/thu hồi quyền camera: Báo rõ, có nút mở cài đặt và đường quay lại
+ Lỗi camera: Báo lỗi kèm nút Thử lại và đường quay lại
+ App ra nền rồi quay lại: Tắt/bật lại camera đúng cách, không treo, không giữ khóa camera
- Điều kiện được thao tác: Chỉ người được giao phiếu, phiếu đang in_progress

M06: Kết quả ảnh/C++
- Người dùng: Kỹ thuật viên được giao phiếu
- Mục tiêu: Xem độ sáng trung bình của ảnh (tính bằng C++), quyết định chụp lại hay giữ ảnh
- Dữ liệu vào: Giá trị brightness (0–255), analysis_version
- Nút chính: Chụp lại; Giữ ảnh
- Màn đi tới: Chụp lại về M05; Giữ ảnh sang M07
- Trạng thái:
+ Loading: Đang tính độ sáng
+ Ảnh tối: Hiện cảnh báo "Ảnh khá tối, nên chụp lại", người dùng tự quyết định
+ Lỗi: Ảnh lỗi hoặc không đọc được thì báo và cho chụp lại, app không bị crash
- Điều kiện được thao tác: Chỉ người được giao phiếu
- Ghi chú: Ảnh tối chỉ là cảnh báo chất lượng ảnh, không phải kết luận thiết bị hỏng

M07: Gửi ảnh & nộp phiếu
- Người dùng: Kỹ thuật viên được giao phiếu
- Mục tiêu: Gửi ảnh lên server rồi nộp phiếu
- Dữ liệu vào: Ảnh, brightness, analysis_version, ghi chú
- Nút chính: Gửi và nộp; Thử lại
- Màn đi tới: M08
- Trạng thái:
+ Loading: Hiện tiến độ tải lên, khóa nút để không gửi hai lần
+ Mất mạng khi gửi: Không báo đã nộp; giữ nguyên ảnh và ghi chú, có nút Thử lại
+ Hết phiên: Đăng nhập lại rồi gửi lại, không mất ảnh
+ Ảnh không hợp lệ: Ảnh quá lớn (trên 5 MiB) hoặc sai định dạng thì báo rõ
+ Xung đột: Phiếu đã đổi (revision cũ) thì báo "Phiếu đã thay đổi", tải lại, không nộp; giữ nguyên ảnh và ghi chú
+ Gửi lại: Không tạo ảnh hay event trùng; nếu ảnh đã lưu thì chỉ gọi lại bước nộp
- Điều kiện được thao tác: Chỉ người được giao phiếu, phiếu đang in_progress; cần ít nhất một ảnh hợp lệ mới nộp được

M08: Kết quả & lịch sử
- Người dùng: Kỹ thuật viên được giao phiếu
- Mục tiêu: Xem phiếu đã nộp hay đã duyệt, hoặc lý do bị trả lại
- Dữ liệu vào: Trạng thái hiện tại, lịch sử sự kiện, lý do trả lại (nếu có)
- Nút chính: Làm bổ sung (chỉ hiện khi phiếu bị trả lại); Về danh sách
- Màn đi tới: Làm bổ sung thì sang M04; Về danh sách thì M02
- Trạng thái:
+ Loading: Đang tải trạng thái mới nhất
+ Rỗng: Không áp dụng (luôn có ít nhất sự kiện tạo phiếu)
+ Lỗi API: Báo lỗi kèm nút thử lại; hết phiên thì về M01
- Điều kiện được thao tác: Chỉ người được giao phiếu. Phiếu đã approved thì không sửa được
