namespace HRMS.Api.Models
{
    public enum UserRole
    {
        Employee,
        HrStaff,
        HrManager,
        Admin
    }

    public enum RequestPriority
    {
        Low,
        Medium,
        High,
        Urgent
    }

    public enum RequestStatus
    {
        New,
        Acknowledged,
        InProgress,
        PendingInfo,
        Resolved,
        Rejected,
        Cancelled,
        Reopened
    }

    public enum CommentType
    {
        Public,
        Internal
    }

    public enum SlaStatus
    {
        OnTrack,
        AtRisk,
        Breached
    }

    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public int DefaultSlaHours { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class Comment
    {
        public int Id { get; set; }
        public int RequestId { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public UserRole AuthorRole { get; set; }
        public string Content { get; set; } = string.Empty;
        public CommentType Type { get; set; } = CommentType.Public;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Attachment
    {
        public int Id { get; set; }
        public int RequestId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }

    public class ActivityLog
    {
        public int Id { get; set; }
        public int RequestId { get; set; }
        public string ActorName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    public class HrRequest
    {
        public int Id { get; set; }
        public string TicketId { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string SubCategory { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public RequestPriority Priority { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.New;

        public int CreatedById { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
        public string CreatedByEmail { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;

        public int? AssignedToId { get; set; }
        public string? AssignedToName { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public DateTime SlaDeadline { get; set; }
        public int SlaPausedMinutes { get; set; }
        public DateTime? SlaPausedAt { get; set; }

        public int? SatisfactionRating { get; set; }
        public string? SatisfactionFeedback { get; set; }

        public List<Comment> Comments { get; set; } = new();
        public List<Attachment> Attachments { get; set; } = new();
        public List<ActivityLog> ActivityLogs { get; set; } = new();

        public SlaStatus GetSlaStatus()
        {
            if (Status == RequestStatus.Resolved || Status == RequestStatus.Rejected || Status == RequestStatus.Cancelled)
            {
                if (ResolvedAt.HasValue && ResolvedAt.Value <= SlaDeadline)
                    return SlaStatus.OnTrack;
                else if (ResolvedAt.HasValue && ResolvedAt.Value > SlaDeadline)
                    return SlaStatus.Breached;
            }

            var now = DateTime.UtcNow;
            if (now > SlaDeadline) return SlaStatus.Breached;

            var totalDuration = (SlaDeadline - CreatedAt).TotalMinutes;
            var remaining = (SlaDeadline - now).TotalMinutes;

            if (totalDuration > 0 && (remaining / totalDuration) <= 0.25)
                return SlaStatus.AtRisk;

            return SlaStatus.OnTrack;
        }
    }

    public class CreateRequestDto
    {
        public int CategoryId { get; set; }
        public string SubCategory { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public RequestPriority Priority { get; set; } = RequestPriority.Medium;
    }

    public class UpdateStatusDto
    {
        public RequestStatus NewStatus { get; set; }
        public string Note { get; set; } = string.Empty;
    }

    public class AssignDto
    {
        public int HrUserId { get; set; }
        public string? Note { get; set; }
    }

    public class AddCommentDto
    {
        public string Content { get; set; } = string.Empty;
        public CommentType Type { get; set; } = CommentType.Public;
    }

    public class RatingDto
    {
        public int Rating { get; set; }
        public string? Feedback { get; set; }
    }
}
