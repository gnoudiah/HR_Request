// ==========================================
// HRMS - Client Data Store (Offline & Server Mode)
// Supports Vercel Static Hosting & ASP.NET Core
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
    status: 2, // InProgress
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
      { id: 1, authorId: 3, authorName: "Lê Thị Mai Anh", content: "Chào Dương, mình đã tiếp nhận và đang liên hệ phòng kế toán để trích xuất phiếu đối chiếu nhé.", type: 0, createdAt: new Date(Date.now() - 10 * 3600000).toISOString() },
      { id: 2, authorId: 3, authorName: "Lê Thị Mai Anh", content: "Note nội bộ: Đã gửi email kế toán thuế check lại hệ thống VssID.", type: 1, createdAt: new Date(Date.now() - 9 * 3600000).toISOString() }
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
    status: 0, // New
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
    status: 4, // Resolved
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

function getStored(key, defaultVal) {
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : defaultVal;
}
function setStored(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

let storeUsers = getStored('hrms_users', INITIAL_USERS);
let storeCategories = getStored('hrms_categories', INITIAL_CATEGORIES);
let storeRequests = getStored('hrms_requests', INITIAL_REQUESTS);

// Application State
let currentUser = null;
let usersList = [];
let categoriesList = [];
let currentViewingTicket = null;
let searchTimer = null;

const STATUS_MAP = {
  0: { label: 'Mới', class: 'bg-blue-50 text-blue-700 border border-blue-200' },
  1: { label: 'Đã tiếp nhận', class: 'bg-sky-50 text-sky-700 border border-sky-200' },
  2: { label: 'Đang xử lý', class: 'bg-amber-50 text-amber-700 border border-amber-200' },
  3: { label: 'Chờ thông tin', class: 'bg-orange-50 text-orange-700 border border-orange-200' },
  4: { label: 'Hoàn thành', class: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  5: { label: 'Từ chối', class: 'bg-rose-50 text-rose-700 border border-rose-200' },
  6: { label: 'Đã hủy', class: 'bg-slate-100 text-slate-500 border border-slate-200' },
  7: { label: 'Mở lại', class: 'bg-purple-50 text-purple-700 border border-purple-200' }
};

const PRIORITY_MAP = {
  0: { label: 'Thấp', class: 'bg-slate-100 text-slate-600' },
  1: { label: 'Bình thường', class: 'bg-blue-100 text-blue-700' },
  2: { label: 'Cao', class: 'bg-orange-100 text-orange-700' },
  3: { label: 'Khẩn cấp', class: 'bg-rose-100 text-rose-700 font-bold' }
};

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  await loadMetadata();
  await loadDashboardStats();
  await loadRequests();

  // Auto-refresh background poll every 10 seconds for real-time collaboration
  setInterval(async () => {
    if (!document.getElementById('createModal').classList.contains('hidden')) return;
    await loadDashboardStats();
    await loadRequests(true);
  }, 10000);
});

async function refreshData() {
  const icon = document.getElementById('refreshIcon');
  if (icon) icon.classList.add('animate-spin');
  try {
    await loadDashboardStats();
    await loadRequests();
  } finally {
    setTimeout(() => {
      if (icon) icon.classList.remove('animate-spin');
    }, 500);
  }
}

// Client-Server API Bridge
async function apiFetch(url, options = {}) {
  options.headers = options.headers || {};
  if (currentUser) {
    options.headers['X-User-Id'] = currentUser.id;
  }

  try {
    const res = await fetch(url, options);
    if (res.ok) {
      return await res.json();
    }
    // If backend responded with 400 or other logical error
    if (res.status === 400 || res.status === 404) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Lỗi xử lý yêu cầu');
    }
  } catch (err) {
    // Only fall back to local store if network completely failed or offline
    if (err.message && (err.message.includes('Lỗi') || err.message.includes('trống') || err.message.includes('bắt buộc'))) {
      throw err;
    }
  }

  // Handle client-side routing fallback
  return clientStoreHandler(url, options);
}

function clientStoreHandler(url, options) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  if (url.includes('/api/HrRequests/users')) {
    return storeUsers;
  }
  if (url.includes('/api/HrRequests/categories')) {
    return storeCategories;
  }
  if (url.includes('/api/HrRequests/dashboard')) {
    const list = storeRequests;
    const total = list.length;
    const newCount = list.filter(r => r.status === 0).length;
    const inProgress = list.filter(r => r.status === 1 || r.status === 2).length;
    const resolved = list.filter(r => r.status === 4).length;
    const breached = list.filter(r => new Date() > new Date(r.slaDeadline) && r.status !== 4 && r.status !== 5 && r.status !== 6).length;
    return {
      total,
      new: newCount,
      inProgress,
      resolved,
      slaBreached: breached,
      slaCompliancePercent: total > 0 ? Math.round(((total - breached) / total) * 100) : 100
    };
  }

  // Create Request
  if (url === '/api/HrRequests' && method === 'POST') {
    const category = storeCategories.find(c => c.id === body.categoryId) || storeCategories[0];
    const newId = storeRequests.length + 1;
    let hours = category.defaultSlaHours;
    if (body.priority === 3) hours = 4;
    else if (body.priority === 2) hours = 8;

    const newReq = {
      id: newId,
      ticketId: `HR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(newId).padStart(4,'0')}`,
      categoryId: category.id,
      categoryName: category.name,
      subCategory: body.subCategory || '',
      subject: body.subject,
      description: body.description,
      priority: body.priority,
      status: 0,
      createdById: currentUser.id,
      createdByName: currentUser.fullName,
      createdByEmail: currentUser.email,
      department: currentUser.department,
      assignedToId: null,
      assignedToName: null,
      createdAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + hours * 3600000).toISOString(),
      activityLogs: [
        { id: 1, actorName: currentUser.fullName, action: "Tạo mới ticket", details: `Gửi yêu cầu '${body.subject}'`, timestamp: new Date().toISOString() }
      ],
      comments: []
    };
    storeRequests.unshift(newReq);
    setStored('hrms_requests', storeRequests);
    return newReq;
  }

  // Query Requests
  if (url.startsWith('/api/HrRequests?') || url === '/api/HrRequests') {
    let result = [...storeRequests];
    if (currentUser && currentUser.role === 0) {
      result = result.filter(r => r.createdById === currentUser.id);
    }
    const params = new URLSearchParams(url.split('?')[1] || '');
    const status = params.get('status');
    const categoryId = params.get('categoryId');
    const search = params.get('search');

    if (status !== null && status !== '') result = result.filter(r => r.status === parseInt(status));
    if (categoryId !== null && categoryId !== '') result = result.filter(r => r.categoryId === parseInt(categoryId));
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r => r.ticketId.toLowerCase().includes(s) || r.subject.toLowerCase().includes(s) || r.createdByName.toLowerCase().includes(s));
    }
    return result;
  }

  // Single Request Detail
  const matchDetail = url.match(/\/api\/HrRequests\/(\d+)$/);
  if (matchDetail) {
    const id = parseInt(matchDetail[1]);
    const req = storeRequests.find(r => r.id === id);
    if (!req) throw new Error("Không tìm thấy yêu cầu");
    const clone = JSON.parse(JSON.stringify(req));
    if (currentUser && currentUser.role === 0) {
      clone.comments = clone.comments.filter(c => c.type === 0);
    }
    return clone;
  }

  // Status Update
  const matchStatus = url.match(/\/api\/HrRequests\/(\d+)\/status$/);
  if (matchStatus) {
    const id = parseInt(matchStatus[1]);
    const req = storeRequests.find(r => r.id === id);
    if (req) {
      req.status = body.newStatus;
      req.activityLogs.push({
        id: req.activityLogs.length + 1,
        actorName: currentUser.fullName,
        action: `Đổi trạng thái: ${STATUS_MAP[body.newStatus].label}`,
        details: body.note || 'Cập nhật trạng thái',
        timestamp: new Date().toISOString()
      });
      setStored('hrms_requests', storeRequests);
    }
    return { success: true };
  }

  // Assign Update
  const matchAssign = url.match(/\/api\/HrRequests\/(\d+)\/assign$/);
  if (matchAssign) {
    const id = parseInt(matchAssign[1]);
    const req = storeRequests.find(r => r.id === id);
    const hr = storeUsers.find(u => u.id === body.hrUserId);
    if (req && hr) {
      req.assignedToId = hr.id;
      req.assignedToName = hr.fullName;
      if (req.status === 0) req.status = 1;
      req.activityLogs.push({
        id: req.activityLogs.length + 1,
        actorName: currentUser.fullName,
        action: "Giao việc (Assign)",
        details: `Gán cho ${hr.fullName}`,
        timestamp: new Date().toISOString()
      });
      setStored('hrms_requests', storeRequests);
    }
    return { success: true };
  }

  // Add Comment
  const matchComment = url.match(/\/api\/HrRequests\/(\d+)\/comments$/);
  if (matchComment) {
    const id = parseInt(matchComment[1]);
    const req = storeRequests.find(r => r.id === id);
    if (req) {
      req.comments.push({
        id: req.comments.length + 1,
        authorId: currentUser.id,
        authorName: currentUser.fullName,
        content: body.content,
        type: body.type || 0,
        createdAt: new Date().toISOString()
      });
      setStored('hrms_requests', storeRequests);
    }
    return { success: true };
  }

  // Rating
  const matchRating = url.match(/\/api\/HrRequests\/(\d+)\/rating$/);
  if (matchRating) {
    const id = parseInt(matchRating[1]);
    const req = storeRequests.find(r => r.id === id);
    if (req) {
      req.satisfactionRating = body.rating;
      req.satisfactionFeedback = body.feedback;
      setStored('hrms_requests', storeRequests);
    }
    return { success: true };
  }

  return { success: true };
}

async function loadMetadata() {
  usersList = await apiFetch('/api/HrRequests/users');
  categoriesList = await apiFetch('/api/HrRequests/categories');

  const userSelect = document.getElementById('userSelector');
  userSelect.innerHTML = usersList.map(u => `
    <option value="${u.id}">${u.fullName} (${getRoleName(u.role)})</option>
  `).join('');
  currentUser = usersList[0];
  updateRoleBadge();

  const catFilter = document.getElementById('categoryFilter');
  const modalCat = document.getElementById('modalCategory');
  const catOptions = categoriesList.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  catFilter.innerHTML = '<option value="">Tất cả danh mục</option>' + catOptions;
  modalCat.innerHTML = catOptions;
}

function getRoleName(role) {
  switch (role) {
    case 0: return 'Nhân viên';
    case 1: return 'HR Staff';
    case 2: return 'HR Manager';
    case 3: return 'Admin';
    default: return '';
  }
}

function updateRoleBadge() {
  const badge = document.getElementById('roleBadge');
  const role = currentUser.role;
  if (role === 0) {
    badge.className = 'text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800';
    badge.textContent = 'Employee';
  } else if (role === 1) {
    badge.className = 'text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-800';
    badge.textContent = 'HR Staff';
  } else if (role === 2) {
    badge.className = 'text-xs px-2.5 py-1 rounded-full font-semibold bg-purple-100 text-purple-800';
    badge.textContent = 'HR Manager';
  } else {
    badge.className = 'text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-200 text-slate-800';
    badge.textContent = 'Admin';
  }
}

function changeCurrentUser() {
  const selectedId = parseInt(document.getElementById('userSelector').value);
  currentUser = usersList.find(u => u.id === selectedId);
  updateRoleBadge();
  loadDashboardStats();
  loadRequests();
  if (currentViewingTicket) {
    openDetailModal(currentViewingTicket.id);
  }
}

async function loadDashboardStats() {
  const s = await apiFetch('/api/HrRequests/dashboard');
  const container = document.getElementById('statsContainer');
  container.innerHTML = `
    <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
      <div class="text-xs text-slate-400 font-medium">Tổng yêu cầu</div>
      <div class="text-xl font-bold text-slate-800 mt-1">${s.total}</div>
    </div>
    <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
      <div class="text-xs text-blue-500 font-medium">Yêu cầu mới</div>
      <div class="text-xl font-bold text-blue-700 mt-1">${s.new}</div>
    </div>
    <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
      <div class="text-xs text-amber-500 font-medium">Đang xử lý</div>
      <div class="text-xl font-bold text-amber-700 mt-1">${s.inProgress}</div>
    </div>
    <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
      <div class="text-xs text-emerald-500 font-medium">Hoàn thành</div>
      <div class="text-xl font-bold text-emerald-700 mt-1">${s.resolved}</div>
    </div>
    <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
      <div class="text-xs text-rose-500 font-medium">SLA Vi phạm</div>
      <div class="text-xl font-bold text-rose-700 mt-1">${s.slaBreached}</div>
    </div>
    <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
      <div class="text-xs text-purple-500 font-medium">SLA Compliance</div>
      <div class="text-xl font-bold text-purple-700 mt-1">${s.slaCompliancePercent}%</div>
    </div>
  `;
}

let activeViewMode = 'all';
let currentUploadedFile = null;

function setViewMode(mode) {
  activeViewMode = mode;
  const tabAll = document.getElementById('tabAll');
  const tabMine = document.getElementById('tabMine');

  if (mode === 'all') {
    tabAll.className = 'px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-sm transition font-bold';
    tabMine.className = 'px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition font-medium';
  } else {
    tabMine.className = 'px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-sm transition font-bold';
    tabAll.className = 'px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition font-medium';
  }
  loadRequests();
}

function handleFilePreview(input) {
  const file = input.files[0];
  if (!file) return;

  const container = document.getElementById('filePreviewContainer');
  const imgPreview = document.getElementById('imgPreview');
  const namePreview = document.getElementById('fileNamePreview');

  namePreview.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
  container.classList.remove('hidden');

  const reader = new FileReader();
  reader.onload = (e) => {
    currentUploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      dataUrl: e.target.result
    };

    if (file.type.startsWith('image/')) {
      imgPreview.src = e.target.result;
      imgPreview.classList.remove('hidden');
    } else {
      imgPreview.classList.add('hidden');
    }
  };
  reader.readAsDataURL(file);
}

function clearFilePreview() {
  document.getElementById('modalAttachment').value = '';
  document.getElementById('filePreviewContainer').classList.add('hidden');
  document.getElementById('imgPreview').src = '';
  document.getElementById('fileNamePreview').textContent = '';
  currentUploadedFile = null;
}

async function loadRequests() {
  const status = document.getElementById('statusFilter').value;
  const categoryId = document.getElementById('categoryFilter').value;
  const search = document.getElementById('searchInput').value;

  let url = `/api/HrRequests?viewMode=${activeViewMode}&`;
  if (status !== '') url += `status=${status}&`;
  if (categoryId !== '') url += `categoryId=${categoryId}&`;
  if (search) url += `search=${encodeURIComponent(search)}&`;

  const list = await apiFetch(url);
  const tbody = document.getElementById('requestsTableBody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-slate-400">Không tìm thấy yêu cầu phù hợp.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(req => {
    const st = STATUS_MAP[req.status] || { label: req.status, class: 'bg-slate-100' };
    const pr = PRIORITY_MAP[req.priority] || { label: req.priority, class: 'bg-slate-100' };
    const slaBadge = formatSlaStatus(req);
    const hasAttach = req.attachment ? '<i class="bi bi-paperclip ml-1 text-brand-600" title="Có tệp đính kèm"></i>' : '';

    return `
      <tr class="hover:bg-slate-50/80 transition cursor-pointer" onclick="openDetailModal(${req.id})">
        <td class="py-3 px-4 font-mono font-bold text-xs text-brand-600">${req.ticketId}</td>
        <td class="py-3 px-4">
          <div class="font-semibold text-slate-800 line-clamp-1 flex items-center">${escapeHtml(req.subject)}${hasAttach}</div>
          <div class="text-xs text-slate-400 mt-0.5">${escapeHtml(req.categoryName)}</div>
        </td>
        <td class="py-3 px-4">
          <div class="font-medium text-slate-700">${escapeHtml(req.createdByName)}</div>
          <div class="text-xs text-slate-400">${escapeHtml(req.department)}</div>
        </td>
        <td class="py-3 px-4"><span class="text-xs px-2 py-0.5 rounded-full ${pr.class}">${pr.label}</span></td>
        <td class="py-3 px-4"><span class="text-xs px-2.5 py-1 rounded-full font-semibold ${st.class}">${st.label}</span></td>
        <td class="py-3 px-4">${slaBadge}</td>
        <td class="py-3 px-4 text-xs font-medium text-slate-600">${req.assignedToName || '<span class="text-slate-400 italic">Chưa giao</span>'}</td>
        <td class="py-3 px-4 text-right">
          <button onclick="event.stopPropagation(); openDetailModal(${req.id})" class="text-brand-600 hover:text-brand-800 text-xs font-semibold px-2 py-1 rounded hover:bg-brand-50">Xem chi tiết &rarr;</button>
        </td>
      </tr>
    `;
  }).join('');
}

function formatSlaStatus(req) {
  const deadline = new Date(req.slaDeadline);
  const now = new Date();
  const isResolved = req.status === 4 || req.status === 5 || req.status === 6;

  if (isResolved) {
    return `<span class="text-xs text-emerald-600 font-semibold"><i class="bi bi-check2-circle"></i> Đã kết thúc</span>`;
  }

  if (now > deadline) {
    return `<span class="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200"><i class="bi bi-exclamation-triangle-fill"></i> Quá hạn SLA</span>`;
  }

  const diffHours = Math.round((deadline - now) / 3600000);
  if (diffHours <= 4) {
    return `<span class="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200"><i class="bi bi-clock-history"></i> Còn ${diffHours}h (Cấp bách)</span>`;
  }
  return `<span class="text-xs text-slate-600 font-medium"><i class="bi bi-clock"></i> Còn ${diffHours}h</span>`;
}

function debounceSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadRequests(), 350);
}

function openCreateModal() {
  document.getElementById('createForm').reset();
  clearFilePreview();
  document.getElementById('createModal').classList.remove('hidden');
}
function closeCreateModal() {
  document.getElementById('createModal').classList.add('hidden');
  clearFilePreview();
}

async function submitCreateRequest(e) {
  e.preventDefault();
  const payload = {
    categoryId: parseInt(document.getElementById('modalCategory').value),
    subCategory: document.getElementById('modalSubCategory').value,
    subject: document.getElementById('modalSubject').value,
    priority: parseInt(document.getElementById('modalPriority').value),
    description: document.getElementById('modalDescription').value,
    attachment: currentUploadedFile
  };

  await apiFetch('/api/HrRequests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  closeCreateModal();
  await loadDashboardStats();
  await loadRequests();
  alert('Đã gửi yêu cầu HR thành công!');
}

async function openDetailModal(id) {
  const req = await apiFetch(`/api/HrRequests/${id}`);
  currentViewingTicket = req;

  document.getElementById('dtTicketId').textContent = req.ticketId;
  document.getElementById('dtSubject').textContent = req.subject;
  document.getElementById('dtDescription').textContent = req.description;
  document.getElementById('dtCreatedBy').textContent = `${req.createdByName} (${req.createdByEmail})`;
  document.getElementById('dtDepartment').textContent = req.department;
  document.getElementById('dtCreatedAt').textContent = new Date(req.createdAt).toLocaleString('vi-VN');
  document.getElementById('dtSlaDeadline').textContent = new Date(req.slaDeadline).toLocaleString('vi-VN');
  document.getElementById('dtAssignedTo').textContent = req.assignedToName || 'Chưa gán nhân sự xử lý';

  // Render attachment if exists
  const attachContainer = document.getElementById('dtAttachmentContainer');
  const attachContent = document.getElementById('dtAttachmentContent');
  if (req.attachment && req.attachment.dataUrl) {
    attachContainer.classList.remove('hidden');
    const isImg = req.attachment.type && req.attachment.type.startsWith('image/');
    if (isImg) {
      attachContent.innerHTML = `
        <div class="mt-2">
          <a href="${req.attachment.dataUrl}" target="_blank" title="Bấm để mở ảnh gốc">
            <img src="${req.attachment.dataUrl}" alt="${escapeHtml(req.attachment.name)}" class="max-h-56 max-w-full rounded-lg border border-slate-200 shadow-sm hover:opacity-95 transition" />
          </a>
          <div class="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <i class="bi bi-image"></i> ${escapeHtml(req.attachment.name)}
          </div>
        </div>
      `;
    } else {
      attachContent.innerHTML = `
        <div class="mt-2">
          <a href="${req.attachment.dataUrl}" download="${escapeHtml(req.attachment.name)}" class="inline-flex items-center space-x-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-brand-700 hover:bg-brand-50 shadow-sm transition">
            <i class="bi bi-file-earmark-arrow-down text-base"></i>
            <span>Tải về: ${escapeHtml(req.attachment.name)}</span>
          </a>
        </div>
      `;
    }
  } else {
    attachContainer.classList.add('hidden');
    attachContent.innerHTML = '';
  }

  const st = STATUS_MAP[req.status] || { label: req.status, class: 'bg-slate-100' };
  const stBadge = document.getElementById('dtStatusBadge');
  stBadge.className = `text-xs px-2.5 py-0.5 rounded-full font-bold ${st.class}`;
  stBadge.textContent = st.label;

  const pr = PRIORITY_MAP[req.priority] || { label: req.priority, class: 'bg-slate-100' };
  const prBadge = document.getElementById('dtPriorityBadge');
  prBadge.className = `text-xs px-2 py-0.5 rounded-full font-semibold ${pr.class}`;
  prBadge.textContent = pr.label;

  const isHrOrAdmin = currentUser.role === 1 || currentUser.role === 2 || currentUser.role === 3;
  document.getElementById('internalNoteToggle').classList.toggle('hidden', !isHrOrAdmin);

  renderActionButtons(req);
  renderComments(req.comments || []);
  renderActivityLogs(req.activityLogs || []);
  renderRating(req);

  document.getElementById('detailModal').classList.remove('hidden');
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.add('hidden');
  currentViewingTicket = null;
}

function renderActionButtons(req) {
  const container = document.getElementById('actionButtons');
  const role = currentUser.role;
  let buttons = '';

  if (role === 1 || role === 2 || role === 3) {
    if (req.status === 0) {
      buttons += `<button onclick="updateTicketStatus(1, 'Tiếp nhận xử lý')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-box-arrow-in-down-right mr-1"></i> Tiếp nhận ticket</button>`;
    }
    if (req.status === 1 || req.status === 3 || req.status === 7) {
      buttons += `<button onclick="updateTicketStatus(2, 'Bắt đầu xử lý nghiệp vụ')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-play-circle mr-1"></i> Bắt đầu xử lý</button>`;
    }
    if (req.status === 2) {
      buttons += `<button onclick="promptStatusWithNote(3, 'Yêu cầu nhân viên bổ sung thông tin:')" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-pause-circle mr-1"></i> Cần bổ sung TT (Tạm dừng SLA)</button>`;
      buttons += `<button onclick="promptStatusWithNote(4, 'Ghi chú kết quả hoàn thành:')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-check-circle mr-1"></i> Hoàn thành ticket</button>`;
      buttons += `<button onclick="promptStatusWithNote(5, 'Nhập lý do từ chối yêu cầu:')" class="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-x-circle mr-1"></i> Từ chối yêu cầu</button>`;
    }
    buttons += `
      <div class="pt-2 border-t border-slate-100">
        <label class="text-[11px] font-semibold text-slate-500 block mb-1">Giao việc cho HR:</label>
        <div class="flex gap-1.5">
          <select id="assignHrSelect" class="flex-1 text-xs border border-slate-300 rounded p-1.5 bg-slate-50">
            ${usersList.filter(u => u.role === 1 || u.role === 2).map(u => `<option value="${u.id}" ${u.id === req.assignedToId ? 'selected' : ''}>${u.fullName}</option>`).join('')}
          </select>
          <button onclick="assignTicket()" class="px-2.5 py-1.5 text-xs bg-slate-800 text-white rounded hover:bg-slate-900">Gán</button>
        </div>
      </div>
    `;
  }

  if (role === 0) {
    if (req.status === 0 || req.status === 1) {
      buttons += `<button onclick="updateTicketStatus(6, 'Nhân viên chủ động hủy')" class="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-trash mr-1"></i> Hủy yêu cầu</button>`;
    }
    if (req.status === 4) {
      buttons += `<button onclick="promptStatusWithNote(7, 'Lý do yêu cầu mở lại ticket:')" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-arrow-repeat mr-1"></i> Mở lại ticket</button>`;
    }
  }

  container.innerHTML = buttons || `<div class="text-xs text-slate-400 italic text-center py-2">Không có hành động khả dụng</div>`;
}

async function updateTicketStatus(newStatus, note) {
  await apiFetch(`/api/HrRequests/${currentViewingTicket.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newStatus, note })
  });
  await loadDashboardStats();
  await loadRequests();
  openDetailModal(currentViewingTicket.id);
}

function promptStatusWithNote(newStatus, promptText) {
  const note = prompt(promptText);
  if (note === null) return;
  if (!note.trim()) {
    alert('Vui lòng nhập nội dung ghi chú bắt buộc.');
    return;
  }
  updateTicketStatus(newStatus, note);
}

async function assignTicket() {
  const hrId = parseInt(document.getElementById('assignHrSelect').value);
  await apiFetch(`/api/HrRequests/${currentViewingTicket.id}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hrUserId: hrId, note: 'Phân công qua giao diện' })
  });
  await loadRequests();
  openDetailModal(currentViewingTicket.id);
}

function renderComments(comments) {
  const container = document.getElementById('dtCommentsList');
  if (!comments.length) {
    container.innerHTML = `<div class="text-center text-slate-400 text-xs py-8">Chưa có bình luận nào. Hãy gửi phản hồi đầu tiên.</div>`;
    return;
  }

  container.innerHTML = comments.map(c => {
    const isMe = c.authorId === currentUser.id;
    const isInternal = c.type === 1;

    return `
      <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'}">
        <div class="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
          <span class="font-semibold text-slate-600">${escapeHtml(c.authorName)}</span>
          ${isInternal ? '<span class="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-bold">Nội bộ HR</span>' : ''}
          <span>${new Date(c.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="text-xs p-3 rounded-2xl max-w-[85%] ${isInternal ? 'bg-amber-50 border border-amber-200 text-amber-900' : (isMe ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none')}">
          ${escapeHtml(c.content)}
        </div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

async function submitComment(e) {
  e.preventDefault();
  const input = document.getElementById('commentInput');
  const isInternal = document.getElementById('isInternalNote').checked;

  await apiFetch(`/api/HrRequests/${currentViewingTicket.id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: input.value,
      type: isInternal ? 1 : 0
    })
  });
  input.value = '';
  document.getElementById('isInternalNote').checked = false;
  openDetailModal(currentViewingTicket.id);
}

function renderActivityLogs(logs) {
  const container = document.getElementById('dtActivityLogs');
  container.innerHTML = logs.map(l => `
    <div class="border-l-2 border-brand-300 pl-2.5 py-0.5">
      <div class="font-medium text-slate-700">${escapeHtml(l.action)}</div>
      <div class="text-[11px] text-slate-500">${escapeHtml(l.details)}</div>
      <div class="text-[10px] text-slate-400 mt-0.5">${new Date(l.timestamp).toLocaleString('vi-VN')} - ${escapeHtml(l.actorName)}</div>
    </div>
  `).join('');
}

function renderRating(req) {
  const section = document.getElementById('ratingSection');
  const display = document.getElementById('ratingDisplay');

  if (req.status !== 4) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');

  if (req.satisfactionRating) {
    display.innerHTML = `
      <div class="text-amber-600 font-bold text-sm">${'★'.repeat(req.satisfactionRating)}${'☆'.repeat(5 - req.satisfactionRating)} (${req.satisfactionRating}/5)</div>
      <div class="text-slate-600 italic mt-1">"${escapeHtml(req.satisfactionFeedback || 'Không có nhận xét')}"</div>
    `;
  } else if (currentUser.id === req.createdById) {
    display.innerHTML = `
      <p class="text-slate-600 mb-2">Đánh giá mức độ hài lòng của bạn về dịch vụ hỗ trợ của HR:</p>
      <div class="flex gap-2">
        ${[1, 2, 3, 4, 5].map(star => `<button onclick="rateTicket(${star})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-xs">${star} ★</button>`).join('')}
      </div>
    `;
  } else {
    display.innerHTML = `<span class="text-slate-400 italic">Nhân viên chưa gửi đánh giá.</span>`;
  }
}

async function rateTicket(stars) {
  const feedback = prompt('Ý kiến đóng góp thêm cho HR (không bắt buộc):');
  await apiFetch(`/api/HrRequests/${currentViewingTicket.id}/rating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: stars, feedback: feedback || '' })
  });
  await loadDashboardStats();
  openDetailModal(currentViewingTicket.id);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
