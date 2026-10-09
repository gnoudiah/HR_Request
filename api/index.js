// ==========================================
// VERCEL SERVERLESS BACKEND API
// Supports Persistent In-Memory State & External REST Sync
// ==========================================

const INITIAL_USERS = [
  { id: 1, email: "employee.duong@company.com", fullName: "Nguyễn Lê Hải Dương", department: "Kỹ thuật (Engineering)", position: "Senior Developer", role: 0 },
  { id: 2, email: "employee.lan@company.com", fullName: "Trần Thị Lan", department: "Marketing", position: "Content Lead", role: 0 },
  { id: 3, email: "hr.anh@company.com", fullName: "Lê Thị Mai Anh", department: "Nhân sự (HR)", position: "HR Executive (C&B)", role: 1 },
  { id: 4, email: "hr.tuan@company.com", fullName: "Phạm Quốc Tuấn", department: "Nhân sự (HR)", position: "HR Executive (Tuyển dụng)", role: 1 },
  { id: 5, email: "manager.ha@company.com", fullName: "Vũ Thu Hà", department: "Nhân sự (HR)", position: "HR Manager", role: 2 },
  { id: 6, email: "admin@company.com", fullName: "Hệ thống Admin", department: "IT", position: "System Administrator", role: 3 }
];

const INITIAL_CATEGORIES = [
  { id: 1, name: "Nghỉ phép & Chấm công", defaultSlaHours: 16 },
  { id: 2, name: "Tiền lương & Phúc lợi (C&B)", defaultSlaHours: 24 },
  { id: 3, name: "Hợp đồng & Hồ sơ pháp lý", defaultSlaHours: 40 },
  { id: 4, name: "Đào tạo & Phát triển", defaultSlaHours: 40 },
  { id: 5, name: "Tuyển dụng & Giới thiệu ứng viên", defaultSlaHours: 24 },
  { id: 6, name: "Ý kiến đóng góp & Khác", defaultSlaHours: 48 }
];

const INITIAL_REQUESTS = [
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
  },
  {
    id: 2,
    ticketId: "HR-20261009-0002",
    categoryId: 1,
    categoryName: "Nghỉ phép & Chấm công",
    subCategory: "Điều chỉnh công quên quẹt thẻ",
    subject: "Giải trình quên quẹt vân tay chiều 08/10",
    description: "Chiều qua em đi gặp khách hàng bên ngoài nên về trễ không quẹt thẻ checkout, nhờ HR bổ sung công giúp.",
    priority: 2,
    status: 0,
    createdById: 2,
    createdByName: "Trần Thị Lan",
    createdByEmail: "employee.lan@company.com",
    department: "Marketing",
    assignedToId: null,
    assignedToName: null,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    slaDeadline: new Date(Date.now() + 14 * 3600000).toISOString(),
    activityLogs: [
      { id: 3, actorName: "Trần Thị Lan", action: "Tạo mới ticket", details: "Ticket mới đang chờ tiếp nhận", timestamp: new Date(Date.now() - 2 * 3600000).toISOString() }
    ],
    comments: []
  },
  {
    id: 3,
    ticketId: "HR-20261009-0003",
    categoryId: 3,
    categoryName: "Hợp đồng & Hồ sơ pháp lý",
    subCategory: "Xác nhận công tác làm Visa",
    subject: "Xin giấy xác nhận công tác xin Visa Nhật Bản",
    description: "Mình cần bản scan và bản gốc giấy xác nhận công tác có dấu tròn công ty để nộp hồ sơ xin visa du lịch.",
    priority: 2,
    status: 4,
    createdById: 1,
    createdByName: "Nguyễn Lê Hải Dương",
    createdByEmail: "employee.duong@company.com",
    department: "Kỹ thuật (Engineering)",
    assignedToId: 3,
    assignedToName: "Lê Thị Mai Anh",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    resolvedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    slaDeadline: new Date(Date.now() - 16 * 3600000).toISOString(),
    satisfactionRating: 5,
    satisfactionFeedback: "HR hỗ trợ in và đóng dấu rất nhanh, cảm ơn bạn Mai Anh!",
    activityLogs: [
      { id: 4, actorName: "Nguyễn Lê Hải Dương", action: "Tạo mới ticket", details: "Đăng ký xin cấp giấy tờ", timestamp: new Date(Date.now() - 48 * 3600000).toISOString() },
      { id: 5, actorName: "Lê Thị Mai Anh", action: "Hoàn thành", details: "Đã gửi bản scan qua email và để bản gốc ở bàn lễ tân", timestamp: new Date(Date.now() - 24 * 3600000).toISOString() }
    ],
    comments: []
  }
];

if (!global._hrmsState) {
  global._hrmsState = {
    users: INITIAL_USERS,
    categories: INITIAL_CATEGORIES,
    requests: INITIAL_REQUESTS
  };
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
  const parsedUrl = new URL(url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  const userId = parseInt(req.headers['x-user-id'] || '1');
  const user = state.users.find(u => u.id === userId) || state.users[0];

  // 1. Users list
  if (pathname.endsWith('/users')) {
    return res.status(200).json(state.users);
  }

  // 2. Categories
  if (pathname.endsWith('/categories')) {
    return res.status(200).json(state.categories);
  }

  // 3. Dashboard Stats
  if (pathname.endsWith('/dashboard')) {
    let list = state.requests;
    if (user.role === 0) {
      list = list.filter(r => r.createdById === user.id);
    }
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
  if (req.method === 'POST' && pathname.endsWith('/HrRequests')) {
    const body = req.body || {};
    if (!body.subject || !body.description) {
      return res.status(400).json({ message: "Tiêu đề và nội dung mô tả không được để trống." });
    }

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
      priority: body.priority !== undefined ? body.priority : 1,
      status: 0,
      createdById: user.id,
      createdByName: user.fullName,
      createdByEmail: user.email,
      department: user.department,
      assignedToId: null,
      assignedToName: null,
      createdAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + hours * 3600000).toISOString(),
      attachment: body.attachment || null,
      activityLogs: [
        { id: 1, actorName: user.fullName, action: "Tạo mới ticket", details: `Gửi yêu cầu '${body.subject}'${body.attachment ? ' (kèm tệp đính kèm)' : ''}`, timestamp: new Date().toISOString() }
      ],
      comments: []
    };

    state.requests.unshift(newReq);
    return res.status(201).json(newReq);
  }

  // 5. Update Status
  const statusMatch = pathname.match(/\/(\d+)\/status$/);
  if (req.method === 'PATCH' && statusMatch) {
    const id = parseInt(statusMatch[1]);
    const r = state.requests.find(x => x.id === id);
    if (!r) return res.status(404).json({ message: "Không tìm thấy yêu cầu" });

    const newStatus = req.body.newStatus;
    const note = req.body.note || '';

    // Business rule checks
    if ((newStatus === 3 || newStatus === 5) && !note.trim()) {
      return res.status(400).json({ message: "Bắt buộc phải nhập lý do/ghi chú." });
    }

    r.status = newStatus;
    if (newStatus === 4) {
      r.resolvedAt = new Date().toISOString();
    }

    r.activityLogs.push({
      id: r.activityLogs.length + 1,
      actorName: user.fullName,
      action: `Đổi trạng thái: ${newStatus}`,
      details: note || 'Cập nhật tiến độ',
      timestamp: new Date().toISOString()
    });
    return res.status(200).json({ success: true });
  }

  // 6. Assign Ticket
  const assignMatch = pathname.match(/\/(\d+)\/assign$/);
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
  const commentMatch = pathname.match(/\/(\d+)\/comments$/);
  if (req.method === 'POST' && commentMatch) {
    const id = parseInt(commentMatch[1]);
    const r = state.requests.find(x => x.id === id);
    if (!r) return res.status(404).json({ message: "Không tìm thấy yêu cầu" });

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

  // 8. Add Rating
  const ratingMatch = pathname.match(/\/(\d+)\/rating$/);
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
  const singleMatch = pathname.match(/\/(\d+)$/);
  if (req.method === 'GET' && singleMatch) {
    const id = parseInt(singleMatch[1]);
    const r = state.requests.find(x => x.id === id);
    if (!r) return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    const clone = JSON.parse(JSON.stringify(r));
    if (user.role === 0) {
      clone.comments = clone.comments.filter(c => c.type === 0);
    }
    return res.status(200).json(clone);
  }

  // 10. Query List with Filters & Search
  if (req.method === 'GET' && (pathname.endsWith('/HrRequests') || pathname.endsWith('/HrRequests/'))) {
    let result = [...state.requests];
    const viewMode = searchParams.get('viewMode') || (user.role === 0 ? 'mine' : 'all');

    if (viewMode === 'mine') {
      result = result.filter(r => r.createdById === user.id);
    } else if (viewMode === 'assigned') {
      result = result.filter(r => r.assignedToId === user.id);
    }
    // if viewMode === 'all', show all company tickets

    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    if (status !== null && status !== '') {
      result = result.filter(r => r.status === parseInt(status));
    }
    if (categoryId !== null && categoryId !== '') {
      result = result.filter(r => r.categoryId === parseInt(categoryId));
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r => 
        r.ticketId.toLowerCase().includes(s) || 
        r.subject.toLowerCase().includes(s) || 
        r.createdByName.toLowerCase().includes(s)
      );
    }

    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "Not found: " + pathname });
}
