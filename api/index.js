// In-memory global store for serverless instance (fallback)
// In production, configure KV_REST_API_URL or POSTGRES_URL in Vercel Environment Variables
let globalState = {
  users: [
    { id: 1, email: "employee.duong@company.com", fullName: "Nguyễn Lê Hải Dương", department: "Kỹ thuật (Engineering)", position: "Senior Developer", role: 0 },
    { id: 2, email: "employee.lan@company.com", fullName: "Trần Thị Lan", department: "Marketing", position: "Content Lead", role: 0 },
    { id: 3, email: "hr.anh@company.com", fullName: "Lê Thị Mai Anh", department: "Nhân sự (HR)", position: "HR Executive (C&B)", role: 1 },
    { id: 4, email: "hr.tuan@company.com", fullName: "Phạm Quốc Tuấn", department: "Nhân sự (HR)", position: "HR Executive (Tuyển dụng)", role: 1 },
    { id: 5, email: "manager.ha@company.com", fullName: "Vũ Thu Hà", department: "Nhân sự (HR)", position: "HR Manager", role: 2 },
    { id: 6, email: "admin@company.com", fullName: "Hệ thống Admin", department: "IT", position: "System Administrator", role: 3 }
  ],
  categories: [
    { id: 1, name: "Nghỉ phép & Chấm công", defaultSlaHours: 16 },
    { id: 2, name: "Tiền lương & Phúc lợi (C&B)", defaultSlaHours: 24 },
    { id: 3, name: "Hợp đồng & Hồ sơ pháp lý", defaultSlaHours: 40 },
    { id: 4, name: "Đào tạo & Phát triển", defaultSlaHours: 40 },
    { id: 5, name: "Tuyển dụng & Giới thiệu ứng viên", defaultSlaHours: 24 },
    { id: 6, name: "Ý kiến đóng góp & Khác", defaultSlaHours: 48 }
  ],
  requests: [
    {
      id: 1,
      ticketId: "HR-20261009-0001",
      categoryId: 2,
      categoryName: "Tiền lương & Phúc lợi (C&B)",
      subCategory: "Thắc mắc bảo hiểm XH",
      subject: "Kiểm tra mức đóng BHXH quý 3/2026",
      description: "Nhờ HR kiểm tra giúp em việc điều chỉnh mức đóng BHXH sau đợt xét tăng lương tháng 8.",
      priority: 1,
      status: 2,
      createdById: 1,
      createdByName: "Nguyễn Lê Hải Dương",
      createdByEmail: "employee.duong@company.com",
      department: "Kỹ thuật (Engineering)",
      assignedToId: 3,
      assignedToName: "Lê Thị Mai Anh",
      createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
      slaDeadline: new Date(Date.now() + 6 * 3600000).toISOString(),
      activityLogs: [
        { id: 1, actorName: "Nguyễn Lê Hải Dương", action: "Tạo mới ticket", details: "Tạo yêu cầu với độ ưu tiên Medium", timestamp: new Date(Date.now() - 18 * 3600000).toISOString() },
        { id: 2, actorName: "Lê Thị Mai Anh", action: "Tiếp nhận & Xử lý", details: "Đã nhận xử lý và đang đối soát dữ liệu thuế BHXH", timestamp: new Date(Date.now() - 10 * 3600000).toISOString() }
      ],
      comments: [
        { id: 1, authorId: 3, authorName: "Lê Thị Mai Anh", content: "Chào Dương, mình đã tiếp nhận và đang liên hệ phòng kế toán để trích xuất phiếu đối chiếu nhé.", type: 0, createdAt: new Date(Date.now() - 10 * 3600000).toISOString() }
      ]
    }
  ]
};

// Global shared variable across warm lambdas
if (!global._hrmsState) {
  global._hrmsState = globalState;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const state = global._hrmsState;
  const url = req.url || '';
  const userId = parseInt(req.headers['x-user-id'] || '1');
  const user = state.users.find(u => u.id === userId) || state.users[0];

  // 1. Users list
  if (url.includes('/api/HrRequests/users')) {
    return res.status(200).json(state.users);
  }

  // 2. Categories
  if (url.includes('/api/HrRequests/categories')) {
    return res.status(200).json(state.categories);
  }

  // 3. Dashboard Stats
  if (url.includes('/api/HrRequests/dashboard')) {
    const list = state.requests;
    const total = list.length;
    const newCount = list.filter(r => r.status === 0).length;
    const inProgress = list.filter(r => r.status === 1 || r.status === 2).length;
    const resolved = list.filter(r => r.status === 4).length;
    const breached = list.filter(r => new Date() > new Date(r.slaDeadline) && r.status !== 4 && r.status !== 5 && r.status !== 6).length;
    return res.status(200).json({
      total,
      new: newCount,
      inProgress,
      resolved,
      slaBreached: breached,
      slaCompliancePercent: total > 0 ? Math.round(((total - breached) / total) * 100) : 100
    });
  }

  // 4. Create Ticket
  if (req.method === 'POST' && (url === '/api/HrRequests' || url.endsWith('/api/HrRequests'))) {
    const body = req.body || {};
    const category = state.categories.find(c => c.id === body.categoryId) || state.categories[0];
    const newId = state.requests.length + 1;
    let hours = category.defaultSlaHours;
    if (body.priority === 3) hours = 4;
    else if (body.priority === 2) hours = 8;

    const newReq = {
      id: newId,
      ticketId: `HR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(newId).padStart(4, '0')}`,
      categoryId: category.id,
      categoryName: category.name,
      subCategory: body.subCategory || '',
      subject: body.subject,
      description: body.description,
      priority: body.priority,
      status: 0,
      createdById: user.id,
      createdByName: user.fullName,
      createdByEmail: user.email,
      department: user.department,
      assignedToId: null,
      assignedToName: null,
      createdAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + hours * 3600000).toISOString(),
      activityLogs: [
        { id: 1, actorName: user.fullName, action: "Tạo mới ticket", details: `Gửi yêu cầu '${body.subject}'`, timestamp: new Date().toISOString() }
      ],
      comments: []
    };

    state.requests.unshift(newReq);
    return res.status(201).json(newReq);
  }

  // 5. Update Status
  const statusMatch = url.match(/\/api\/HrRequests\/(\d+)\/status/);
  if (req.method === 'PATCH' && statusMatch) {
    const id = parseInt(statusMatch[1]);
    const r = state.requests.find(x => x.id === id);
    if (r) {
      r.status = req.body.newStatus;
      r.activityLogs.push({
        id: r.activityLogs.length + 1,
        actorName: user.fullName,
        action: `Đổi trạng thái: ${req.body.newStatus}`,
        details: req.body.note || 'Cập nhật tiến độ',
        timestamp: new Date().toISOString()
      });
      return res.status(200).json({ success: true });
    }
  }

  // 6. Assign Ticket
  const assignMatch = url.match(/\/api\/HrRequests\/(\d+)\/assign/);
  if (req.method === 'PATCH' && assignMatch) {
    const id = parseInt(assignMatch[1]);
    const r = state.requests.find(x => x.id === id);
    const hr = state.users.find(u => u.id === req.body.hrUserId);
    if (r && hr) {
      r.assignedToId = hr.id;
      r.assignedToName = hr.fullName;
      if (r.status === 0) r.status = 1;
      r.activityLogs.push({
        id: r.activityLogs.length + 1,
        actorName: user.fullName,
        action: "Giao việc (Assign)",
        details: `Gán cho ${hr.fullName}`,
        timestamp: new Date().toISOString()
      });
      return res.status(200).json({ success: true });
    }
  }

  // 7. Add Comment
  const commentMatch = url.match(/\/api\/HrRequests\/(\d+)\/comments/);
  if (req.method === 'POST' && commentMatch) {
    const id = parseInt(commentMatch[1]);
    const r = state.requests.find(x => x.id === id);
    if (r) {
      r.comments.push({
        id: r.comments.length + 1,
        authorId: user.id,
        authorName: user.fullName,
        content: req.body.content,
        type: req.body.type || 0,
        createdAt: new Date().toISOString()
      });
      return res.status(200).json({ success: true });
    }
  }

  // 8. Add Rating
  const ratingMatch = url.match(/\/api\/HrRequests\/(\d+)\/rating/);
  if (req.method === 'POST' && ratingMatch) {
    const id = parseInt(ratingMatch[1]);
    const r = state.requests.find(x => x.id === id);
    if (r) {
      r.satisfactionRating = req.body.rating;
      r.satisfactionFeedback = req.body.feedback;
      return res.status(200).json({ success: true });
    }
  }

  // 9. Single Ticket Details
  const singleMatch = url.match(/\/api\/HrRequests\/(\d+)(\?.*)?$/);
  if (req.method === 'GET' && singleMatch) {
    const id = parseInt(singleMatch[1]);
    const r = state.requests.find(x => x.id === id);
    if (!r) return res.status(404).json({ message: "Không tìm thấy" });
    const clone = JSON.parse(JSON.stringify(r));
    if (user.role === 0) {
      clone.comments = clone.comments.filter(c => c.type === 0);
    }
    return res.status(200).json(clone);
  }

  // 10. Query List
  if (req.method === 'GET' && url.includes('/api/HrRequests')) {
    let result = [...state.requests];
    if (user.role === 0) {
      result = result.filter(r => r.createdById === user.id);
    }
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "Not found" });
}
