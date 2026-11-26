# BÀI 4. BẢO MẬT ỨNG DỤNG ĐÁM MÂY

## 1. Kết quả kiểm thử bảo mật

| Nội dung kiểm thử | Kết quả | Đánh giá |
|---|---|---|
| Truy cập không có JWT | 401 | PASS |
| Truy cập có JWT hợp lệ | 200 | PASS |
| SV1 truy cập ghi chú của mình | 200 | PASS |
| SV2 truy cập ghi chú của SV1 | 404 | PASS |
| Đăng nhập sai lần thứ 20 | 401 | PASS |
| Đăng nhập sai lần thứ 21 | 429 | PASS |

## 2. Phần C – So sánh kết quả quét Trivy

| Image | Kích thước (Content Size) | HIGH | CRITICAL |
|---|---:|---:|---:|
| node:22-alpine | 71,5 MB | 10 | 0 |
| node:22 | 419 MB | 479 | 20 |

**Nhận xét:** Image Alpine có kích thước nhỏ hơn và ít lỗ hổng được báo cáo hơn so với image Node.js đầy đủ. Nhóm ưu tiên sử dụng Alpine để giảm kích thước triển khai và bề mặt tấn công.

Tại thời điểm kiểm tra Dependabot, repository không có cảnh báo đang mở. Cần kiểm tra lại sau khi push mã nguồn mới.

## 3. Phần D – Phân tích quyết định rủi ro

| Nội dung | Phân tích |
|---|---|
| Cấu hình | Network Access 0.0.0.0/0 |
| Rủi ro | Mọi địa chỉ IPv4 đều có thể thử kết nối, làm tăng nguy cơ dò mật khẩu và truy cập trái phép. |
| Biện pháp bù trừ | Giới hạn tài khoản database ở quyền readWrite trên một cơ sở dữ liệu. |
| Biện pháp bù trừ | Sử dụng mật khẩu mạnh, ngẫu nhiên. |
| Biện pháp bù trừ | TLS bảo vệ dữ liệu truyền tải. |
| Biện pháp bù trừ | Lưu bí mật trong Codespaces Secrets thay vì mã nguồn. |
| Phương án cải thiện | Sử dụng IP tĩnh, IP Allowlist giới hạn, Private Endpoint hoặc VPC Peering. |

## 4. Câu hỏi phản biện

### Câu 1. Nếu JWT bị lộ trong thời hạn một giờ thì sao?

Kẻ có token hợp lệ có thể mạo danh người dùng cho đến khi token hết hạn. Hệ thống hiện tại không hỗ trợ thu hồi riêng từng JWT ngay lập tức.

Có thể khắc phục bằng danh sách token bị thu hồi lưu trong Redis hoặc sử dụng Access Token ngắn hạn kết hợp Refresh Token. Chi phí là tăng tài nguyên lưu trữ và độ phức tạp của hệ thống.

### Câu 2. Vì sao Alpine thường có ít lỗ hổng hơn?

Alpine chứa ít gói phần mềm hơn, giúp giảm bề mặt tấn công. Tuy nhiên, ít lỗ hổng được báo cáo không đồng nghĩa với an toàn tuyệt đối. Cần đánh giá mức độ nghiêm trọng, khả năng khai thác và độ đầy đủ của cơ sở dữ liệu lỗ hổng.

### Câu 3. Mô hình trách nhiệm chia sẻ

MongoDB Atlas và Supabase chịu trách nhiệm bảo mật hạ tầng, duy trì dịch vụ và cung cấp các cơ chế bảo mật thuộc phạm vi dịch vụ quản lý.

Nhóm phát triển chịu trách nhiệm quản lý bí mật, cấu hình mạng, phân quyền cơ sở dữ liệu, xác thực JWT, bảo vệ dữ liệu và cập nhật các thư viện ứng dụng.