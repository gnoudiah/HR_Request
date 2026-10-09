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
});

async function apiFetch(url, options = {}) {
  options.headers = options.headers || {};
  if (currentUser) {
    options.headers['X-User-Id'] = currentUser.id;
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Lỗi xử lý yêu cầu');
  }
  return res.json();
}

async function loadMetadata() {
  try {
    usersList = await apiFetch('/api/HrRequests/users');
    categoriesList = await apiFetch('/api/HrRequests/categories');

    // Populate user switcher
    const userSelect = document.getElementById('userSelector');
    userSelect.innerHTML = usersList.map(u => `
      <option value="${u.id}">${u.fullName} (${getRoleName(u.role)})</option>
    `).join('');
    currentUser = usersList[0];
    updateRoleBadge();

    // Populate category dropdowns
    const catFilter = document.getElementById('categoryFilter');
    const modalCat = document.getElementById('modalCategory');
    const catOptions = categoriesList.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    catFilter.innerHTML += catOptions;
    modalCat.innerHTML = catOptions;
  } catch (err) {
    console.error('Metadata error:', err);
  }
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
  try {
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
  } catch (err) {
    console.error(err);
  }
}

async function loadRequests() {
  const status = document.getElementById('statusFilter').value;
  const categoryId = document.getElementById('categoryFilter').value;
  const search = document.getElementById('searchInput').value;

  let url = '/api/HrRequests?';
  if (status !== '') url += `status=${status}&`;
  if (categoryId !== '') url += `categoryId=${categoryId}&`;
  if (search) url += `search=${encodeURIComponent(search)}&`;

  try {
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

      return `
        <tr class="hover:bg-slate-50/80 transition cursor-pointer" onclick="openDetailModal(${req.id})">
          <td class="py-3 px-4 font-mono font-bold text-xs text-brand-600">${req.ticketId}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-slate-800 line-clamp-1">${escapeHtml(req.subject)}</div>
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
  } catch (err) {
    console.error(err);
  }
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

// CREATE REQUEST MODAL
function openCreateModal() {
  document.getElementById('createForm').reset();
  document.getElementById('createModal').classList.remove('hidden');
}
function closeCreateModal() {
  document.getElementById('createModal').classList.add('hidden');
}

async function submitCreateRequest(e) {
  e.preventDefault();
  const payload = {
    categoryId: parseInt(document.getElementById('modalCategory').value),
    subCategory: document.getElementById('modalSubCategory').value,
    subject: document.getElementById('modalSubject').value,
    priority: parseInt(document.getElementById('modalPriority').value),
    description: document.getElementById('modalDescription').value
  };

  try {
    await apiFetch('/api/HrRequests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    closeCreateModal();
    await loadDashboardStats();
    await loadRequests();
    alert('Đã gửi yêu cầu HR thành công!');
  } catch (err) {
    alert(err.message);
  }
}

// DETAIL MODAL & INTERACTIONS
async function openDetailModal(id) {
  try {
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

    const st = STATUS_MAP[req.status] || { label: req.status, class: 'bg-slate-100' };
    const stBadge = document.getElementById('dtStatusBadge');
    stBadge.className = `text-xs px-2.5 py-0.5 rounded-full font-bold ${st.class}`;
    stBadge.textContent = st.label;

    const pr = PRIORITY_MAP[req.priority] || { label: req.priority, class: 'bg-slate-100' };
    const prBadge = document.getElementById('dtPriorityBadge');
    prBadge.className = `text-xs px-2 py-0.5 rounded-full font-semibold ${pr.class}`;
    prBadge.textContent = pr.label;

    // Toggle Internal Note feature for HR only
    const isHrOrAdmin = currentUser.role === 1 || currentUser.role === 2 || currentUser.role === 3;
    document.getElementById('internalNoteToggle').classList.toggle('hidden', !isHrOrAdmin);

    // Render Action Buttons according to RBAC and State Machine
    renderActionButtons(req);

    // Render Comments
    renderComments(req.comments || []);

    // Render Activity Logs
    renderActivityLogs(req.activityLogs || []);

    // Render Rating
    renderRating(req);

    document.getElementById('detailModal').classList.remove('hidden');
  } catch (err) {
    alert(err.message);
  }
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.add('hidden');
  currentViewingTicket = null;
}

function renderActionButtons(req) {
  const container = document.getElementById('actionButtons');
  const role = currentUser.role;
  let buttons = '';

  // HR Staff / Manager Actions
  if (role === 1 || role === 2 || role === 3) {
    if (req.status === 0) { // New -> Acknowledge
      buttons += `<button onclick="updateTicketStatus(1, 'Tiếp nhận xử lý')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-box-arrow-in-down-right mr-1"></i> Tiếp nhận ticket</button>`;
    }
    if (req.status === 1 || req.status === 3 || req.status === 7) { // Start InProgress
      buttons += `<button onclick="updateTicketStatus(2, 'Bắt đầu xử lý nghiệp vụ')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-play-circle mr-1"></i> Bắt đầu xử lý</button>`;
    }
    if (req.status === 2) {
      buttons += `<button onclick="promptStatusWithNote(3, 'Yêu cầu nhân viên bổ sung thông tin:')" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-pause-circle mr-1"></i> Cần bổ sung TT (Tạm dừng SLA)</button>`;
      buttons += `<button onclick="promptStatusWithNote(4, 'Ghi chú kết quả hoàn thành:')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-check-circle mr-1"></i> Hoàn thành ticket</button>`;
      buttons += `<button onclick="promptStatusWithNote(5, 'Nhập lý do từ chối yêu cầu:')" class="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 rounded-lg text-xs"><i class="bi bi-x-circle mr-1"></i> Từ chối yêu cầu</button>`;
    }
    // Re-assign dropdown for HR
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

  // Employee Actions
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
  try {
    await apiFetch(`/api/HrRequests/${currentViewingTicket.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newStatus, note })
    });
    await loadDashboardStats();
    await loadRequests();
    openDetailModal(currentViewingTicket.id);
  } catch (err) {
    alert(err.message);
  }
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
  try {
    await apiFetch(`/api/HrRequests/${currentViewingTicket.id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hrUserId: hrId, note: 'Phân công qua giao diện' })
    });
    await loadRequests();
    openDetailModal(currentViewingTicket.id);
  } catch (err) {
    alert(err.message);
  }
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

  try {
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
  } catch (err) {
    alert(err.message);
  }
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
  try {
    await apiFetch(`/api/HrRequests/${currentViewingTicket.id}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: stars, feedback: feedback || '' })
    });
    await loadDashboardStats();
    openDetailModal(currentViewingTicket.id);
  } catch (err) {
    alert(err.message);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
