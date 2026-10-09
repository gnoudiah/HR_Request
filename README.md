# 🏢 HR Request Management System (HRMS)

Hệ thống quản lý và xử lý yêu cầu Nhân sự (HR Request Management System) được phát triển theo đúng chuẩn **Product Requirements Document (PRD v1.0)**.

---

## 🎯 Tính năng chính (Theo PRD)

1. **Employee Portal**:
   - Gửi yêu cầu HR theo danh mục (Nghỉ phép, C&B, Hợp đồng, Đào tạo, Tuyển dụng,...).
   - Đính kèm tệp tin và chỉ định mức độ ưu tiên (Low, Medium, High, Urgent).
   - Theo dõi trạng thái thời gian thực và thời hạn cam kết SLA.
   - Bình luận phản hồi và đánh giá mức độ hài lòng (CSAT 1-5 sao).

2. **HR Workspace & Manager Dashboard**:
   - Tiếp nhận tập trung tất cả yêu cầu, phân loại và gán người xử lý (Assign/Re-assign).
   - Quản trị vòng đời yêu cầu theo State Machine: `New` ➔ `Acknowledged` ➔ `InProgress` ➔ `PendingInfo` ➔ `Resolved` / `Rejected` ➔ `Reopened` / `Cancelled`.
   - **Ghi chú nội bộ (Internal Notes)**: Chỉ nhân sự HR và Quản lý nhìn thấy.
   - **Cơ chế SLA thông minh**: Cảnh báo On-track / At-risk / Breached; tự động đóng băng (Pause) thời gian SLA khi yêu cầu nhân viên bổ sung thông tin (`PendingInfo`).
   - Thống kê thời gian thực: Tỷ lệ SLA Compliance, khối lượng công việc, đánh giá dịch vụ.

3. **Kiến trúc kỹ thuật**:
   - Backend: ASP.NET Core (.NET 7), RESTful Web API, Dependency Injection, Swagger Documentation.
   - Frontend: Single Page Application (SPA), Tailwind CSS, Bootstrap Icons, Responsive UI.
   - Tài liệu gốc: `PRD_HR_Request_Management_System.docx` tương thích MS Word 2013.

---

## 🚀 Hướng dẫn khởi chạy ứng dụng

### Yêu cầu môi trường
- Đã cài đặt [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0).

### Lệnh chạy
Tại thư mục `Test`, thực thi lệnh:

```bash
cd HRMS.Api
dotnet run
```

Sau khi chạy, mở trình duyệt truy cập:
- **Web App Portal:** `http://localhost:5000` (hoặc port hiển thị trên terminal).
- **Swagger API Docs:** `http://localhost:5000/swagger`.
