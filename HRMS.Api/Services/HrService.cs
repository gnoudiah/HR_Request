using HRMS.Api.Models;

namespace HRMS.Api.Services
{
    public interface IHrService
    {
        IEnumerable<User> GetUsers();
        User? GetUser(int id);
        IEnumerable<Category> GetCategories();
        IEnumerable<HrRequest> GetRequests(int currentUserId, UserRole role, RequestStatus? status = null, int? categoryId = null, string? search = null);
        HrRequest? GetRequestById(int id, int currentUserId, UserRole role);
        HrRequest CreateRequest(int userId, CreateRequestDto dto);
        bool UpdateStatus(int requestId, int currentUserId, UpdateStatusDto dto, out string errorMessage);
        bool AssignRequest(int requestId, int currentUserId, AssignDto dto, out string errorMessage);
        bool AddComment(int requestId, int currentUserId, AddCommentDto dto, out string errorMessage);
        bool AddRating(int requestId, int currentUserId, RatingDto dto, out string errorMessage);
        object GetDashboardStats(int currentUserId, UserRole role);
    }

    public class HrService : IHrService
    {
        private static readonly List<User> _users = new()
        {
            new User { Id = 1, Email = "employee.duong@company.com", FullName = "Nguyễn Lê Hải Dương", Department = "Kỹ thuật (Engineering)", Position = "Senior Developer", Role = UserRole.Employee },
            new User { Id = 2, Email = "employee.lan@company.com", FullName = "Trần Thị Lan", Department = "Marketing", Position = "Content Lead", Role = UserRole.Employee },
            new User { Id = 3, Email = "hr.anh@company.com", FullName = "Lê Thị Mai Anh", Department = "Nhân sự (HR)", Position = "HR Executive (C&B)", Role = UserRole.HrStaff },
            new User { Id = 4, Email = "hr.tuan@company.com", FullName = "Phạm Quốc Tuấn", Department = "Nhân sự (HR)", Position = "HR Executive (Tuyển dụng)", Role = UserRole.HrStaff },
            new User { Id = 5, Email = "manager.ha@company.com", FullName = "Vũ Thu Hà", Department = "Nhân sự (HR)", Position = "HR Manager", Role = UserRole.HrManager },
            new User { Id = 6, Email = "admin@company.com", FullName = "Hệ thống Admin", Department = "IT", Position = "System Administrator", Role = UserRole.Admin }
        };

        private static readonly List<Category> _categories = new()
        {
            new Category { Id = 1, Name = "Nghỉ phép & Chấm công", DefaultSlaHours = 16 },
            new Category { Id = 2, Name = "Tiền lương & Phúc lợi (C&B)", DefaultSlaHours = 24 },
            new Category { Id = 3, Name = "Hợp đồng & Hồ sơ pháp lý", DefaultSlaHours = 40 },
            new Category { Id = 4, Name = "Đào tạo & Phát triển", DefaultSlaHours = 40 },
            new Category { Id = 5, Name = "Tuyển dụng & Giới thiệu ứng viên", DefaultSlaHours = 24 },
            new Category { Id = 6, Name = "Ý kiến đóng góp & Khác", DefaultSlaHours = 48 }
        };

        private static readonly List<HrRequest> _requests = new();
        private static int _nextRequestId = 1;
        private static readonly object _lock = new();

        public HrService()
        {
            lock (_lock)
            {
                if (!_requests.Any())
                {
                    SeedInitialData();
                }
            }
        }

        private void SeedInitialData()
        {
            var req1 = new HrRequest
            {
                Id = _nextRequestId++,
                TicketId = "HR-20261009-0001",
                CategoryId = 2,
                CategoryName = "Tiền lương & Phúc lợi (C&B)",
                SubCategory = "Thắc mắc bảo hiểm XH",
                Subject = "Kiểm tra mức đóng BHXH quý 3/2026",
                Description = "Nhờ HR kiểm tra giúp em việc điều chỉnh mức đóng BHXH sau đợt xét tăng lương tháng 8.",
                Priority = RequestPriority.Medium,
                Status = RequestStatus.InProgress,
                CreatedById = 1,
                CreatedByName = "Nguyễn Lê Hải Dương",
                CreatedByEmail = "employee.duong@company.com",
                Department = "Kỹ thuật (Engineering)",
                AssignedToId = 3,
                AssignedToName = "Lê Thị Mai Anh",
                CreatedAt = DateTime.UtcNow.AddHours(-18),
                SlaDeadline = DateTime.UtcNow.AddHours(6),
                ActivityLogs = new List<ActivityLog>
                {
                    new ActivityLog { Id = 1, RequestId = 1, ActorName = "Nguyễn Lê Hải Dương", Action = "Tạo mới ticket", Details = "Tạo yêu cầu với độ ưu tiên Medium", Timestamp = DateTime.UtcNow.AddHours(-18) },
                    new ActivityLog { Id = 2, RequestId = 1, ActorName = "Lê Thị Mai Anh", Action = "Tiếp nhận & Xử lý", Details = "Đã nhận xử lý và đang đối soát dữ liệu thuế BHXH", Timestamp = DateTime.UtcNow.AddHours(-10) }
                },
                Comments = new List<Comment>
                {
                    new Comment { Id = 1, RequestId = 1, AuthorId = 3, AuthorName = "Lê Thị Mai Anh", AuthorRole = UserRole.HrStaff, Content = "Chào Dương, mình đã tiếp nhận và đang liên hệ phòng kế toán để trích xuất phiếu đối chiếu nhé.", Type = CommentType.Public, CreatedAt = DateTime.UtcNow.AddHours(-10) },
                    new Comment { Id = 2, RequestId = 1, AuthorId = 3, AuthorName = "Lê Thị Mai Anh", AuthorRole = UserRole.HrStaff, Content = "Note nội bộ: Đã gửi email kế toán thuế check lại hệ thống VssID.", Type = CommentType.Internal, CreatedAt = DateTime.UtcNow.AddHours(-9) }
                }
            };

            var req2 = new HrRequest
            {
                Id = _nextRequestId++,
                TicketId = "HR-20261009-0002",
                CategoryId = 1,
                CategoryName = "Nghỉ phép & Chấm công",
                SubCategory = "Điều chỉnh công quên quẹt thẻ",
                Subject = "Giải trình quên quẹt vân tay chiều 08/10",
                Description = "Chiều qua em đi gặp khách hàng bên ngoài nên về trễ không quẹt thẻ checkout, nhờ HR bổ sung công giúp.",
                Priority = RequestPriority.High,
                Status = RequestStatus.New,
                CreatedById = 2,
                CreatedByName = "Trần Thị Lan",
                CreatedByEmail = "employee.lan@company.com",
                Department = "Marketing",
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                SlaDeadline = DateTime.UtcNow.AddHours(14),
                ActivityLogs = new List<ActivityLog>
                {
                    new ActivityLog { Id = 3, RequestId = 2, ActorName = "Trần Thị Lan", Action = "Tạo mới ticket", Details = "Ticket mới đang chờ tiếp nhận", Timestamp = DateTime.UtcNow.AddHours(-2) }
                }
            };

            var req3 = new HrRequest
            {
                Id = _nextRequestId++,
                TicketId = "HR-20261009-0003",
                CategoryId = 3,
                CategoryName = "Hợp đồng & Hồ sơ pháp lý",
                SubCategory = "Xác nhận công tác làm Visa",
                Subject = "Xin giấy xác nhận công tác xin Visa Nhật Bản",
                Description = "Mình cần bản scan và bản gốc giấy xác nhận công tác có dấu tròn công ty để nộp hồ sơ xin visa du lịch.",
                Priority = RequestPriority.High,
                Status = RequestStatus.Resolved,
                CreatedById = 1,
                CreatedByName = "Nguyễn Lê Hải Dương",
                CreatedByEmail = "employee.duong@company.com",
                Department = "Kỹ thuật (Engineering)",
                AssignedToId = 3,
                AssignedToName = "Lê Thị Mai Anh",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                ResolvedAt = DateTime.UtcNow.AddDays(-1),
                SlaDeadline = DateTime.UtcNow.AddDays(-1).AddHours(8),
                SatisfactionRating = 5,
                SatisfactionFeedback = "HR hỗ trợ in và đóng dấu rất nhanh, cảm ơn bạn Mai Anh!",
                ActivityLogs = new List<ActivityLog>
                {
                    new ActivityLog { Id = 4, RequestId = 3, ActorName = "Nguyễn Lê Hải Dương", Action = "Tạo mới ticket", Details = "Đăng ký xin cấp giấy tờ", Timestamp = DateTime.UtcNow.AddDays(-2) },
                    new ActivityLog { Id = 5, RequestId = 3, ActorName = "Lê Thị Mai Anh", Action = "Hoàn thành", Details = "Đã gửi bản scan qua email và để bản gốc ở bàn lễ tân", Timestamp = DateTime.UtcNow.AddDays(-1) }
                }
            };

            _requests.Add(req1);
            _requests.Add(req2);
            _requests.Add(req3);
        }

        public IEnumerable<User> GetUsers() => _users;

        public User? GetUser(int id) => _users.FirstOrDefault(u => u.Id == id);

        public IEnumerable<Category> GetCategories() => _categories.Where(c => c.IsActive);

        public IEnumerable<HrRequest> GetRequests(int currentUserId, UserRole role, RequestStatus? status = null, int? categoryId = null, string? search = null)
        {
            var query = _requests.AsQueryable();

            if (role == UserRole.Employee)
            {
                query = query.Where(r => r.CreatedById == currentUserId);
            }

            if (status.HasValue)
            {
                query = query.Where(r => r.Status == status.Value);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(r => r.CategoryId == categoryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(r => r.TicketId.ToLower().Contains(search)
                                      || r.Subject.ToLower().Contains(search)
                                      || r.CreatedByName.ToLower().Contains(search));
            }

            return query.OrderByDescending(r => r.CreatedAt).ToList();
        }

        public HrRequest? GetRequestById(int id, int currentUserId, UserRole role)
        {
            var req = _requests.FirstOrDefault(r => r.Id == id);
            if (req == null) return null;

            // Security check: Employee can only see their own requests
            if (role == UserRole.Employee && req.CreatedById != currentUserId)
            {
                return null;
            }

            // Clone request for employee to hide internal notes
            if (role == UserRole.Employee)
            {
                var clone = new HrRequest
                {
                    Id = req.Id,
                    TicketId = req.TicketId,
                    CategoryId = req.CategoryId,
                    CategoryName = req.CategoryName,
                    SubCategory = req.SubCategory,
                    Subject = req.Subject,
                    Description = req.Description,
                    Priority = req.Priority,
                    Status = req.Status,
                    CreatedById = req.CreatedById,
                    CreatedByName = req.CreatedByName,
                    CreatedByEmail = req.CreatedByEmail,
                    Department = req.Department,
                    AssignedToId = req.AssignedToId,
                    AssignedToName = req.AssignedToName,
                    CreatedAt = req.CreatedAt,
                    UpdatedAt = req.UpdatedAt,
                    ResolvedAt = req.ResolvedAt,
                    SlaDeadline = req.SlaDeadline,
                    SlaPausedMinutes = req.SlaPausedMinutes,
                    SatisfactionRating = req.SatisfactionRating,
                    SatisfactionFeedback = req.SatisfactionFeedback,
                    Attachments = req.Attachments,
                    ActivityLogs = req.ActivityLogs,
                    Comments = req.Comments.Where(c => c.Type == CommentType.Public).ToList()
                };
                return clone;
            }

            return req;
        }

        public HrRequest CreateRequest(int userId, CreateRequestDto dto)
        {
            var user = GetUser(userId) ?? _users[0];
            var category = _categories.FirstOrDefault(c => c.Id == dto.CategoryId) ?? _categories[0];

            int hours = category.DefaultSlaHours;
            if (dto.Priority == RequestPriority.Urgent) hours = Math.Max(4, hours / 4);
            else if (dto.Priority == RequestPriority.High) hours = Math.Max(8, hours / 2);

            var req = new HrRequest
            {
                Id = _nextRequestId++,
                TicketId = $"HR-{DateTime.UtcNow:yyyyMMdd}-{_nextRequestId:D4}",
                CategoryId = category.Id,
                CategoryName = category.Name,
                SubCategory = dto.SubCategory,
                Subject = dto.Subject,
                Description = dto.Description,
                Priority = dto.Priority,
                Status = RequestStatus.New,
                CreatedById = user.Id,
                CreatedByName = user.FullName,
                CreatedByEmail = user.Email,
                Department = user.Department,
                CreatedAt = DateTime.UtcNow,
                SlaDeadline = DateTime.UtcNow.AddHours(hours),
                ActivityLogs = new List<ActivityLog>
                {
                    new ActivityLog
                    {
                        Id = 1,
                        RequestId = _nextRequestId - 1,
                        ActorName = user.FullName,
                        Action = "Tạo mới ticket",
                        Details = $"Gửi yêu cầu '{dto.Subject}' thuộc nhóm '{category.Name}' (SLA: {hours}h làm việc)",
                        Timestamp = DateTime.UtcNow
                    }
                }
            };

            lock (_lock)
            {
                _requests.Insert(0, req);
            }

            return req;
        }

        public bool UpdateStatus(int requestId, int currentUserId, UpdateStatusDto dto, out string errorMessage)
        {
            errorMessage = string.Empty;
            var req = _requests.FirstOrDefault(r => r.Id == requestId);
            if (req == null)
            {
                errorMessage = "Không tìm thấy yêu cầu.";
                return false;
            }

            var user = GetUser(currentUserId);
            if (user == null)
            {
                errorMessage = "Người dùng không hợp lệ.";
                return false;
            }

            // State Machine rules
            if (user.Role == UserRole.Employee)
            {
                if (dto.NewStatus == RequestStatus.Cancelled)
                {
                    if (req.Status != RequestStatus.New && req.Status != RequestStatus.Acknowledged)
                    {
                        errorMessage = "Nhân viên chỉ có thể hủy yêu cầu khi đang ở trạng thái 'Mới' hoặc 'Đã tiếp nhận'.";
                        return false;
                    }
                }
                else if (dto.NewStatus == RequestStatus.Reopened)
                {
                    if (req.Status != RequestStatus.Resolved)
                    {
                        errorMessage = "Chỉ có thể mở lại khi yêu cầu đã hoàn thành.";
                        return false;
                    }
                }
                else
                {
                    errorMessage = "Nhân viên không có quyền chuyển sang trạng thái này.";
                    return false;
                }
            }

            if ((dto.NewStatus == RequestStatus.Rejected || dto.NewStatus == RequestStatus.PendingInfo) && string.IsNullOrWhiteSpace(dto.Note))
            {
                errorMessage = "Bắt buộc phải nhập lý do / nội dung ghi chú khi Từ chối hoặc Yêu cầu bổ sung thông tin.";
                return false;
            }

            var oldStatus = req.Status;
            req.Status = dto.NewStatus;
            req.UpdatedAt = DateTime.UtcNow;

            // Handle SLA pause / resume
            if (dto.NewStatus == RequestStatus.PendingInfo)
            {
                req.SlaPausedAt = DateTime.UtcNow;
            }
            else if (oldStatus == RequestStatus.PendingInfo && req.SlaPausedAt.HasValue)
            {
                var pausedDuration = (int)(DateTime.UtcNow - req.SlaPausedAt.Value).TotalMinutes;
                req.SlaPausedMinutes += pausedDuration;
                req.SlaDeadline = req.SlaDeadline.AddMinutes(pausedDuration);
                req.SlaPausedAt = null;
            }

            if (dto.NewStatus == RequestStatus.Resolved)
            {
                req.ResolvedAt = DateTime.UtcNow;
            }

            req.ActivityLogs.Add(new ActivityLog
            {
                Id = req.ActivityLogs.Count + 1,
                RequestId = req.Id,
                ActorName = user.FullName,
                Action = $"Đổi trạng thái: {oldStatus} -> {dto.NewStatus}",
                Details = string.IsNullOrWhiteSpace(dto.Note) ? "Chuyển trạng thái xử lý" : dto.Note,
                Timestamp = DateTime.UtcNow
            });

            return true;
        }

        public bool AssignRequest(int requestId, int currentUserId, AssignDto dto, out string errorMessage)
        {
            errorMessage = string.Empty;
            var req = _requests.FirstOrDefault(r => r.Id == requestId);
            if (req == null)
            {
                errorMessage = "Không tìm thấy yêu cầu.";
                return false;
            }

            var hrStaff = _users.FirstOrDefault(u => u.Id == dto.HrUserId && (u.Role == UserRole.HrStaff || u.Role == UserRole.HrManager));
            if (hrStaff == null)
            {
                errorMessage = "Nhân sự HR được chỉ định không hợp lệ.";
                return false;
            }

            var actor = GetUser(currentUserId) ?? _users[0];
            req.AssignedToId = hrStaff.Id;
            req.AssignedToName = hrStaff.FullName;
            req.UpdatedAt = DateTime.UtcNow;

            if (req.Status == RequestStatus.New)
            {
                req.Status = RequestStatus.Acknowledged;
            }

            req.ActivityLogs.Add(new ActivityLog
            {
                Id = req.ActivityLogs.Count + 1,
                RequestId = req.Id,
                ActorName = actor.FullName,
                Action = "Phân công xử lý (Assign)",
                Details = $"Giao yêu cầu cho {hrStaff.FullName}. {dto.Note}",
                Timestamp = DateTime.UtcNow
            });

            return true;
        }

        public bool AddComment(int requestId, int currentUserId, AddCommentDto dto, out string errorMessage)
        {
            errorMessage = string.Empty;
            var req = _requests.FirstOrDefault(r => r.Id == requestId);
            if (req == null)
            {
                errorMessage = "Không tìm thấy yêu cầu.";
                return false;
            }

            var user = GetUser(currentUserId) ?? _users[0];

            if (dto.Type == CommentType.Internal && user.Role == UserRole.Employee)
            {
                errorMessage = "Nhân viên không được phép tạo ghi chú nội bộ.";
                return false;
            }

            var comment = new Comment
            {
                Id = req.Comments.Count + 1,
                RequestId = req.Id,
                AuthorId = user.Id,
                AuthorName = user.FullName,
                AuthorRole = user.Role,
                Content = dto.Content,
                Type = dto.Type,
                CreatedAt = DateTime.UtcNow
            };

            req.Comments.Add(comment);
            req.UpdatedAt = DateTime.UtcNow;

            req.ActivityLogs.Add(new ActivityLog
            {
                Id = req.ActivityLogs.Count + 1,
                RequestId = req.Id,
                ActorName = user.FullName,
                Action = dto.Type == CommentType.Internal ? "Ghi chú nội bộ HR" : "Phản hồi tin nhắn",
                Details = dto.Content.Length > 60 ? dto.Content[..60] + "..." : dto.Content,
                Timestamp = DateTime.UtcNow
            });

            return true;
        }

        public bool AddRating(int requestId, int currentUserId, RatingDto dto, out string errorMessage)
        {
            errorMessage = string.Empty;
            var req = _requests.FirstOrDefault(r => r.Id == requestId);
            if (req == null)
            {
                errorMessage = "Không tìm thấy yêu cầu.";
                return false;
            }

            if (req.CreatedById != currentUserId)
            {
                errorMessage = "Chỉ người tạo yêu cầu mới được quyền đánh giá.";
                return false;
            }

            if (req.Status != RequestStatus.Resolved)
            {
                errorMessage = "Chỉ có thể đánh giá khi yêu cầu đã hoàn thành.";
                return false;
            }

            if (req.SatisfactionRating.HasValue)
            {
                errorMessage = "Yêu cầu này đã được đánh giá trước đó.";
                return false;
            }

            req.SatisfactionRating = Math.Clamp(dto.Rating, 1, 5);
            req.SatisfactionFeedback = dto.Feedback;
            req.UpdatedAt = DateTime.UtcNow;

            req.ActivityLogs.Add(new ActivityLog
            {
                Id = req.ActivityLogs.Count + 1,
                RequestId = req.Id,
                ActorName = req.CreatedByName,
                Action = "Đánh giá chất lượng xử lý",
                Details = $"{dto.Rating} sao - Phản hồi: {dto.Feedback}",
                Timestamp = DateTime.UtcNow
            });

            return true;
        }

        public object GetDashboardStats(int currentUserId, UserRole role)
        {
            var userReqs = _requests.AsQueryable();
            if (role == UserRole.Employee)
            {
                userReqs = userReqs.Where(r => r.CreatedById == currentUserId);
            }

            var total = userReqs.Count();
            var newCount = userReqs.Count(r => r.Status == RequestStatus.New);
            var inProgress = userReqs.Count(r => r.Status == RequestStatus.InProgress || r.Status == RequestStatus.Acknowledged);
            var pendingInfo = userReqs.Count(r => r.Status == RequestStatus.PendingInfo);
            var resolved = userReqs.Count(r => r.Status == RequestStatus.Resolved);

            var atRisk = userReqs.Count(r => r.GetSlaStatus() == SlaStatus.AtRisk);
            var breached = userReqs.Count(r => r.GetSlaStatus() == SlaStatus.Breached);

            var avgRating = _requests.Where(r => r.SatisfactionRating.HasValue).Select(r => r.SatisfactionRating!.Value).DefaultIfEmpty(0).Average();

            return new
            {
                Total = total,
                New = newCount,
                InProgress = inProgress,
                PendingInfo = pendingInfo,
                Resolved = resolved,
                SlaAtRisk = atRisk,
                SlaBreached = breached,
                AverageRating = Math.Round(avgRating, 1),
                SlaCompliancePercent = total > 0 ? Math.Round((double)(total - breached) / total * 100, 1) : 100
            };
        }
    }
}
