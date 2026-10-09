using HRMS.Api.Models;
using HRMS.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HrRequestsController : ControllerBase
    {
        private readonly IHrService _hrService;

        public HrRequestsController(IHrService hrService)
        {
            _hrService = hrService;
        }

        [HttpGet("users")]
        public IActionResult GetUsers() => Ok(_hrService.GetUsers());

        [HttpGet("categories")]
        public IActionResult GetCategories() => Ok(_hrService.GetCategories());

        [HttpGet]
        public IActionResult GetRequests(
            [FromHeader(Name = "X-User-Id")] int userId = 1,
            [FromQuery] RequestStatus? status = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? search = null)
        {
            var user = _hrService.GetUser(userId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            var requests = _hrService.GetRequests(user.Id, user.Role, status, categoryId, search);
            return Ok(requests);
        }

        [HttpGet("{id}")]
        public IActionResult GetRequestById(int id, [FromHeader(Name = "X-User-Id")] int userId = 1)
        {
            var user = _hrService.GetUser(userId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            var req = _hrService.GetRequestById(id, user.Id, user.Role);
            if (req == null) return NotFound(new { message = "Không tìm thấy yêu cầu hoặc bạn không có quyền xem." });

            return Ok(req);
        }

        [HttpPost]
        public IActionResult CreateRequest([FromBody] CreateRequestDto dto, [FromHeader(Name = "X-User-Id")] int userId = 1)
        {
            var user = _hrService.GetUser(userId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            if (string.IsNullOrWhiteSpace(dto.Subject) || string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest(new { message = "Tiêu đề và nội dung mô tả không được để trống." });
            }

            var result = _hrService.CreateRequest(user.Id, dto);
            return CreatedAtAction(nameof(GetRequestById), new { id = result.Id }, result);
        }

        [HttpPatch("{id}/status")]
        public IActionResult UpdateStatus(int id, [FromBody] UpdateStatusDto dto, [FromHeader(Name = "X-User-Id")] int userId = 1)
        {
            var user = _hrService.GetUser(userId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            var success = _hrService.UpdateStatus(id, user.Id, dto, out var error);
            if (!success) return BadRequest(new { message = error });

            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }

        [HttpPatch("{id}/assign")]
        public IActionResult AssignRequest(int id, [FromBody] AssignDto dto, [FromHeader(Name = "X-User-Id")] int userId = 1)
        {
            var user = _hrService.GetUser(userId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            if (user.Role != UserRole.HrStaff && user.Role != UserRole.HrManager && user.Role != UserRole.Admin)
            {
                return Forbid();
            }

            var success = _hrService.AssignRequest(id, user.Id, dto, out var error);
            if (!success) return BadRequest(new { message = error });

            return Ok(new { message = "Phân công xử lý thành công" });
        }

        [HttpPost("{id}/comments")]
        public IActionResult AddComment(int id, [FromBody] AddCommentDto dto, [FromHeader(Name = "X-User-Id")] int userId = 1)
        {
            var user = _hrService.GetUser(userId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            if (string.IsNullOrWhiteSpace(dto.Content))
            {
                return BadRequest(new { message = "Nội dung phản hồi không được để trống." });
            }

            var success = _hrService.AddComment(id, user.Id, dto, out var error);
            if (!success) return BadRequest(new { message = error });

            return Ok(new { message = "Đã gửi phản hồi" });
        }

        [HttpPost("{id}/rating")]
        public IActionResult AddRating(int id, [FromBody] RatingDto dto, [FromHeader(Name = "X-User-Id")] int userId = 1)
        {
            var user = _hrService.GetUser(userId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            var success = _hrService.AddRating(id, user.Id, dto, out var error);
            if (!success) return BadRequest(new { message = error });

            return Ok(new { message = "Cảm ơn bạn đã gửi đánh giá!" });
        }

        [HttpGet("dashboard")]
        public IActionResult GetDashboard([FromHeader(Name = "X-User-Id")] int userId = 1)
        {
            var user = _hrService.GetUser(userId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            var stats = _hrService.GetDashboardStats(user.Id, user.Role);
            return Ok(stats);
        }
    }
}
