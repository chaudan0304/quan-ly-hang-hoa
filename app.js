/**
 * Quản Lý Hàng Hóa - Main JavaScript Application (v4.1 Updated Master Products List)
 * Features:
 * - Render Grid & LocalStorage Persistence (55+ Real Products)
 * - Customer Mode (View Only) vs Admin Mode (Edit & Manage)
 * - Admin Authentication (Default PIN: 1234)
 * - Out of Stock (Hết Hàng) Badge & Quick Toggle Feature
 * - Real-time Search Filter
 * - Edit / Update Price & Image (Base64 file upload & URL support)
 * - Format Currency in VNĐ
 * - PWA Service Worker Registration for Offline Usage
 * - Export & Import JSON Backup Data
 */

const STORAGE_KEY = 'quanlyhanghoa_items_v3';
const ADMIN_SESSION_KEY = 'quanlyhanghoa_is_admin';
const ADMIN_PASSWORD_KEY = 'quanlyhanghoa_admin_pass';

// Default Admin Password is "1234"
const DEFAULT_ADMIN_PASS = '1234';

// Updated Master Dataset (55 Products)
const DEFAULT_PRODUCTS = [
  { "id": "prod_1785414851829_vtkz2", "name": "Bờm tóc nhựa dẻo", "price": 10000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414835860_9ob2t", "name": "Ví 2 ngăn", "price": 20000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414819690_u824c", "name": "Ví nhỏ 1 ngăn", "price": 10000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414801330_e2m4e", "name": "Thun quần", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414787238_74coj", "name": "Tăm", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414763343_j2f6o", "name": "Găng tay rửa bát cỡ L", "price": 17000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414711730_gm276", "name": "Găng tay rửa bát cỡ S", "price": 12000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414630472_eeuby", "name": "Găng tay vải đen có cao su", "price": 7000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414600048_6oi6w", "name": "Găng tay vải đen", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414576583_4zdwv", "name": "Que lấy ráy tai", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414550527_fhmtd", "name": "Quạt", "price": 15000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785414525476_skt2x", "name": "Ống tay", "price": 15000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413483663_oviwm", "name": "Bông tắm", "price": 15000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413443753_hyvdg", "name": "Tấm cước rửa bát", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413382199_jt3zt", "name": "Nùi sắt rửa bát", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413349698_r75jb", "name": "Nhíp", "price": 6000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413333600_7gy1x", "name": "Lưới rửa bát", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413286535_3njxg", "name": "Long não", "price": 3000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413268240_pqkgy", "name": "Kim găm", "price": 1000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413206690_zw847", "name": "Khẩu trang thường", "price": 10000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413196205_biwxh", "name": "Khẩu trang tai mèo", "price": 15000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413107569_wf7xo", "name": "Kẹp tăm to", "price": 1000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413092164_85lp8", "name": "Kẹp nơ búi", "price": 25000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413072506_jq8jm", "name": "Kẹp mĩ nhỏ", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785413060628_uyjdt", "name": "Kẹp mĩ to", "price": 3000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785412044850_q8g52", "name": "Kẹp bật to", "price": 3000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785412032986_e4uz6", "name": "Kẹp bật nhỏ", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785411950000_6clcm", "name": "Gương", "price": 10000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785411927584_0qhir", "name": "Dao gọt vỏ", "price": 7000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785411905084_ratq9", "name": "Chỉ may", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785411876918_wsjf3", "name": "Dây buộc tóc thường", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785411809860_091go", "name": "Dây buộc tóc hạt cườm", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785411051062_g4vcv", "name": "Bàn chải nhựa", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785411038698_dh0q2", "name": "Bàn chải gỗ", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785411019770_w199i", "name": "Băng đô", "price": 20000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410754630_2pvn9", "name": "Bông ngoáy tai", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410730966_qjl7n", "name": "Thuốc kiến", "price": 2000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410675449_ad0t2", "name": "Kim may bì", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410665195_ep087", "name": "3 kim may đồ", "price": 1000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410624018_nf5zl", "name": "Dính ruồi", "price": 500, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410614845_pbnki", "name": "Dính chuột", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410594457_zzt65", "name": "Quai nón nhung", "price": 10000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410568451_a7bqj", "name": "Quai nón thường", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410541930_n5bu4", "name": "Nón nhựa", "price": 20000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410505906_ltvna", "name": "Dây buộc tóc nhung", "price": 5000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410431143_ks330", "name": "Khăn tắm to", "price": 30000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410397395_5h63u", "name": "Khăn tắm nhỏ", "price": 20000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410227344_yhhvq", "name": "Nón dừa", "price": 45000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410183797_bolt5", "name": "Bấm móng tay nhỏ", "price": 6000, "image": "", "isOutOfStock": false },
  { "id": "prod_1785410126455_k8sgc", "name": "Lược dày", "price": 6000, "image": "", "isOutOfStock": false },
  { "id": "prod_luoc", "name": "Lược thường", "price": 5000, "image": "assets/luoc.png", "isOutOfStock": false },
  { "id": "prod_bam_mong", "name": "Bấm móng tay to", "price": 10000, "image": "assets/bam_mong_tay.png", "isOutOfStock": false },
  { "id": "prod_non_la", "name": "Nón Huế", "price": 35000, "image": "assets/non_la.png", "isOutOfStock": false },
  { "id": "prod_khan_mat", "name": "Khăn mặt", "price": 10000, "image": "assets/khan_mat.png", "isOutOfStock": false },
  { "id": "prod_day_buoc", "name": "Bộ dây buộc tóc nhiều màu", "price": 500, "image": "assets/day_buoc_toc.png", "isOutOfStock": false }
];

// App State
let products = [];
let editingImageBase64 = '';
let itemToDeleteId = null;
let isAdmin = false;

// DOM Element References
const productGrid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const emptyStateMsg = document.getElementById('emptyStateMsg');
const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const statTotalItems = document.getElementById('statTotalItems');
const statOutOfStockItems = document.getElementById('statOutOfStockItems');
const statTotalValue = document.getElementById('statTotalValue');
const statTotalValueCard = document.getElementById('statTotalValueCard');
const itemCountBadge = document.getElementById('itemCountBadge');

// Role & Admin Elements
const roleBadge = document.getElementById('roleBadge');
const roleIcon = document.getElementById('roleIcon');
const roleText = document.getElementById('roleText');
const btnLoginAdmin = document.getElementById('btnLoginAdmin');
const btnLogoutAdmin = document.getElementById('btnLogoutAdmin');
const adminControls = document.getElementById('adminControls');
const btnEmptyAdd = document.getElementById('btnEmptyAdd');

// Admin Login Modal Elements
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPasswordInput = document.getElementById('adminPassword');
const btnTogglePassword = document.getElementById('btnTogglePassword');
const btnCloseAdminModal = document.getElementById('btnCloseAdminModal');
const btnCancelAdminLogin = document.getElementById('btnCancelAdminLogin');

// Export / Import Elements
const btnExportData = document.getElementById('btnExportData');
const btnImportData = document.getElementById('btnImportData');
const importFileInput = document.getElementById('importFileInput');

// Product Form Modal Elements
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const productIdInput = document.getElementById('productId');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productOutOfStockInput = document.getElementById('productOutOfStock');
const priceFormattedHint = document.getElementById('priceFormattedHint');

const tabUpload = document.getElementById('tabUpload');
const tabUrl = document.getElementById('tabUrl');
const panelUpload = document.getElementById('panelUpload');
const panelUrl = document.getElementById('panelUrl');
const productImageFileInput = document.getElementById('productImageFile');
const productImageUrlInput = document.getElementById('productImageUrl');
const imagePreview = document.getElementById('imagePreview');
const previewPlaceholder = document.getElementById('previewPlaceholder');

const btnAddProduct = document.getElementById('btnAddProduct');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancelModal = document.getElementById('btnCancelModal');

// Delete Modal Elements
const deleteModal = document.getElementById('deleteModal');
const deleteProductName = document.getElementById('deleteProductName');
const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
const btnCancelDelete = document.getElementById('btnCancelDelete');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');

const toastContainer = document.getElementById('toastContainer');

// ==========================================
// Service Worker Registration for PWA Offline
// ==========================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('[PWA] ServiceWorker registered scope:', reg.scope))
      .catch((err) => console.warn('[PWA] ServiceWorker failed:', err));
  });
}

// ==========================================
// Initialization & LocalStorage Helpers
// ==========================================

function initApp() {
  loadAdminState();
  loadProducts();
  setupEventListeners();
  render();

  if (navigator.onLine) {
    fetchLatestFromCloud();
  }
}

function loadAdminState() {
  const sessionAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY);
  isAdmin = sessionAdmin === 'true';
  updateRoleUI();
}

function loadProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        products = parsed;
      } else {
        products = [...DEFAULT_PRODUCTS];
        saveProductsLocally();
      }
    } else {
      products = [...DEFAULT_PRODUCTS];
      saveProductsLocally();
    }
  } catch (err) {
    console.error('Error loading products from LocalStorage:', err);
    products = [...DEFAULT_PRODUCTS];
  }
}

function saveProductsLocally() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving to LocalStorage:', err);
    showToast('Không thể lưu dữ liệu (Dung lượng bộ nhớ vượt giới hạn)', 'error');
  }
}

function saveAndSyncProducts(actionType = 'update') {
  saveProductsLocally();
  render();
}

// ==========================================
// Admin Authentication Logic
// ==========================================

function updateRoleUI() {
  if (isAdmin) {
    roleBadge.className = 'role-badge admin';
    roleIcon.className = 'fa-solid fa-user-shield';
    roleText.textContent = 'Quản trị viên';
    
    btnLoginAdmin.classList.add('hidden');
    btnLogoutAdmin.classList.remove('hidden');
    adminControls.classList.remove('hidden');
    btnEmptyAdd.classList.remove('hidden');
    if (statTotalValueCard) statTotalValueCard.classList.remove('hidden');
  } else {
    roleBadge.className = 'role-badge customer';
    roleIcon.className = 'fa-solid fa-user-tag';
    roleText.textContent = 'Khách hàng (Chỉ xem giá)';
    
    btnLoginAdmin.classList.remove('hidden');
    btnLogoutAdmin.classList.add('hidden');
    adminControls.classList.add('hidden');
    btnEmptyAdd.classList.add('hidden');
    if (statTotalValueCard) statTotalValueCard.classList.add('hidden');
  }
}

function openAdminLoginModal() {
  adminPasswordInput.value = '';
  adminLoginModal.classList.remove('hidden');
  adminPasswordInput.focus();
}

function closeAdminLoginModal() {
  adminLoginModal.classList.add('hidden');
}

function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const inputPass = adminPasswordInput.value.trim();
  const savedPass = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASS;

  if (inputPass === savedPass) {
    isAdmin = true;
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    updateRoleUI();
    render();
    closeAdminLoginModal();
    showToast('Đã đăng nhập quyền Quản trị viên thành công!');
  } else {
    showToast('Mật khẩu Admin không chính xác!', 'error');
    adminPasswordInput.focus();
  }
}

function handleAdminLogout() {
  isAdmin = false;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  updateRoleUI();
  render();
  showToast('Đã chuyển sang Chế độ Khách hàng (Chỉ xem giá)', 'info');
}

// Out of Stock Toggle Helper (Admin Mode)
function toggleOutOfStock(id) {
  if (!isAdmin) {
    openAdminLoginModal();
    return;
  }
  const item = products.find(p => p.id === id);
  if (!item) return;

  item.isOutOfStock = !item.isOutOfStock;
  const statusMsg = item.isOutOfStock ? `Đã đánh dấu "${item.name}" là HẾT HÀNG` : `Đã chuyển "${item.name}" thành CÒN HÀNG`;
  saveAndSyncProducts('toggle_stock');
  showToast(statusMsg, item.isOutOfStock ? 'info' : 'success');
}

// ==========================================
// Export & Import Backup Helpers
// ==========================================

function exportDataJSON() {
  if (!isAdmin) {
    showToast('Chức năng này chỉ dành cho Quản trị viên!', 'error');
    return;
  }
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `danh-sach-hang-hoa_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất file sao lưu dữ liệu thành công!');
  } catch (err) {
    showToast('Lỗi khi xuất dữ liệu', 'error');
  }
}

function importDataJSON(event) {
  if (!isAdmin) {
    showToast('Chức năng này chỉ dành cho Quản trị viên!', 'error');
    return;
  }
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (Array.isArray(importedData)) {
        products = importedData;
        saveAndSyncProducts('import');
        showToast('Đã nhập thành công ' + products.length + ' hàng hóa từ file!');
      } else {
        showToast('File dữ liệu không đúng định dạng', 'error');
      }
    } catch (err) {
      showToast('Không thể đọc file JSON', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ==========================================
// Master Dataset Fetcher
// ==========================================

async function fetchLatestFromCloud() {
  if (!navigator.onLine) return;
  try {
    const response = await fetch('./products.json?t=' + Date.now(), { cache: 'no-store' });
    if (response.ok) {
      const serverItems = await response.json();
      if (Array.isArray(serverItems) && serverItems.length > 0) {
        const hasCustomData = localStorage.getItem(STORAGE_KEY);
        if (!hasCustomData) {
          products = serverItems;
          saveProductsLocally();
          render();
        }
      }
    }
  } catch (err) {
    console.warn('Fetch products.json warning:', err);
  }
}

// ==========================================
// Utility Functions
// ==========================================

function formatVND(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

function generateId() {
  return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'info' ? 'fa-circle-info' : 'fa-circle-exclamation');
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================
// Rendering Engine
// ==========================================

function render() {
  const query = searchInput.value.trim().toLowerCase();
  
  // Filter products by query
  const filteredProducts = products.filter(item => 
    item.name.toLowerCase().includes(query)
  );

  // Update Stats
  const totalItems = products.length;
  const outOfStockCount = products.filter(p => p.isOutOfStock).length;
  const totalVal = products.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  statTotalItems.textContent = totalItems;
  statOutOfStockItems.textContent = outOfStockCount;
  statTotalValue.textContent = formatVND(totalVal);

  itemCountBadge.textContent = `${filteredProducts.length} sản phẩm`;

  if (query.length > 0) {
    btnClearSearch.classList.remove('hidden');
  } else {
    btnClearSearch.classList.add('hidden');
  }

  // Handle Empty State
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
    if (query.length > 0) {
      emptyStateMsg.textContent = `Không tìm thấy hàng hóa nào khớp với từ khóa "${query}".`;
    } else {
      emptyStateMsg.textContent = 'Danh sách hàng hóa hiện đang trống.';
    }
    return;
  }

  emptyState.classList.add('hidden');

  // Render Cards Grid
  productGrid.innerHTML = filteredProducts.map(item => {
    const hasImg = item.image && item.image.trim() !== '';
    const isOut = Boolean(item.isOutOfStock);

    return `
      <div class="product-card ${isOut ? 'is-out-of-stock' : ''}" data-id="${item.id}">
        <div class="card-img-wrapper">
          ${isOut ? `<span class="stock-tag-overlay out"><i class="fa-solid fa-ban"></i> HẾT HÀNG</span>` : ''}
          ${hasImg ? 
            `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'no-image-fallback\\'><i class=\\'fa-solid fa-image-slash\\'></i><span>Không tải được ảnh</span></div>';">` : 
            `<div class="no-image-fallback">
              <i class="fa-solid fa-image"></i>
              <span>Chưa có hình ảnh</span>
             </div>`
          }
        </div>
        <div class="card-content">
          <h3 class="product-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h3>
          <div class="price-row">
            <div class="price-tag ${isOut ? 'out-of-stock-tag' : ''}">
              <i class="fa-solid ${isOut ? 'fa-circle-xmark' : 'fa-tag'}"></i>
              <span class="price-amount">${isOut ? 'HẾT HÀNG (' + formatVND(item.price) + ')' : formatVND(item.price)}</span>
            </div>
          </div>
          ${isAdmin ? `
            <div class="card-actions">
              <button class="btn-card-action btn-card-stock ${isOut ? 'is-out' : 'is-in'}" onclick="toggleOutOfStock('${item.id}')">
                <i class="fa-solid ${isOut ? 'fa-box-open' : 'fa-ban'}"></i> ${isOut ? 'Chuyển sang CÒN HÀNG' : 'Đánh dấu HẾT HÀNG'}
              </button>
              <div class="card-actions-row">
                <button class="btn-card-action btn-card-edit" onclick="openEditModal('${item.id}')">
                  <i class="fa-solid fa-pen"></i> Sửa giá & ảnh
                </button>
                <button class="btn-card-action btn-card-delete" onclick="openDeleteModal('${item.id}')">
                  <i class="fa-solid fa-trash"></i> Xóa
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

// ==========================================
// Modal & Editing Actions (Admin Only)
// ==========================================

function openAddModal() {
  if (!isAdmin) {
    openAdminLoginModal();
    return;
  }
  modalTitle.innerHTML = '<i class="fa-solid fa-plus"></i> Thêm Hàng Hóa Mới';
  productIdInput.value = '';
  productNameInput.value = '';
  productPriceInput.value = '';
  productImageUrlInput.value = '';
  productOutOfStockInput.checked = false;
  editingImageBase64 = '';
  
  updatePriceHint(0);
  switchTab('upload');
  clearPreview();

  productModal.classList.remove('hidden');
  productNameInput.focus();
}

function openEditModal(id) {
  if (!isAdmin) {
    openAdminLoginModal();
    return;
  }
  const item = products.find(p => p.id === id);
  if (!item) return;

  modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Chỉnh Sửa Hàng Hóa';
  productIdInput.value = item.id;
  productNameInput.value = item.name;
  productPriceInput.value = item.price;
  productOutOfStockInput.checked = Boolean(item.isOutOfStock);
  
  updatePriceHint(item.price);

  if (item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'))) {
    switchTab('url');
    productImageUrlInput.value = item.image;
    editingImageBase64 = '';
    setPreviewImage(item.image);
  } else if (item.image) {
    switchTab('upload');
    productImageUrlInput.value = '';
    editingImageBase64 = item.image;
    setPreviewImage(item.image);
  } else {
    switchTab('upload');
    productImageUrlInput.value = '';
    editingImageBase64 = '';
    clearPreview();
  }

  productModal.classList.remove('hidden');
  productPriceInput.focus();
}

function closeModal() {
  productModal.classList.add('hidden');
}

function switchTab(tab) {
  if (tab === 'upload') {
    tabUpload.classList.add('active');
    tabUrl.classList.remove('active');
    panelUpload.classList.remove('hidden');
    panelUrl.classList.add('hidden');
  } else {
    tabUrl.classList.add('active');
    tabUpload.classList.remove('active');
    panelUrl.classList.remove('hidden');
    panelUpload.classList.add('hidden');
  }
}

function setPreviewImage(src) {
  if (src && src.trim() !== '') {
    imagePreview.src = src;
    imagePreview.classList.remove('hidden');
    previewPlaceholder.classList.add('hidden');
  } else {
    clearPreview();
  }
}

function clearPreview() {
  imagePreview.src = '';
  imagePreview.classList.add('hidden');
  previewPlaceholder.classList.remove('hidden');
}

function updatePriceHint(val) {
  priceFormattedHint.textContent = `Định dạng hiển thị: ${formatVND(val)}`;
}

// Handle Form Submission (Save Price & Image & Stock Status)
function handleFormSubmit(e) {
  e.preventDefault();

  if (!isAdmin) {
    showToast('Bạn cần đăng nhập Admin để thực hiện thao tác này', 'error');
    return;
  }

  const id = productIdInput.value;
  const name = productNameInput.value.trim();
  const price = Number(productPriceInput.value) || 0;
  const isOutOfStock = productOutOfStockInput.checked;

  let finalImage = '';
  if (tabUpload.classList.contains('active')) {
    finalImage = editingImageBase64;
  } else {
    finalImage = productImageUrlInput.value.trim();
  }

  if (!name) {
    showToast('Vui lòng nhập tên hàng hóa', 'error');
    return;
  }

  if (id) {
    // Update existing item
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        name,
        price,
        image: finalImage,
        isOutOfStock
      };
      showToast(`Đã cập nhật hàng hóa "${name}" thành công!`);
    }
  } else {
    // Add new item
    const newItem = {
      id: generateId(),
      name,
      price,
      image: finalImage,
      isOutOfStock
    };
    products.unshift(newItem);
    showToast(`Đã thêm mới hàng hóa "${name}"!`);
  }

  saveAndSyncProducts();
  closeModal();
}

// Delete Confirmation Modal
function openDeleteModal(id) {
  if (!isAdmin) {
    openAdminLoginModal();
    return;
  }
  const item = products.find(p => p.id === id);
  if (!item) return;

  itemToDeleteId = id;
  deleteProductName.textContent = item.name;
  deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  itemToDeleteId = null;
}

function confirmDelete() {
  if (!itemToDeleteId || !isAdmin) return;

  const item = products.find(p => p.id === itemToDeleteId);
  const name = item ? item.name : 'hàng hóa';

  products = products.filter(p => p.id !== itemToDeleteId);
  saveAndSyncProducts();
  closeDeleteModal();
  showToast(`Đã xóa "${name}" khỏi danh sách.`, 'info');
}

// ==========================================
// Event Listeners Setup
// ==========================================

function setupEventListeners() {
  // Admin Login / Logout Buttons
  btnLoginAdmin.addEventListener('click', openAdminLoginModal);
  btnLogoutAdmin.addEventListener('click', handleAdminLogout);
  btnCloseAdminModal.addEventListener('click', closeAdminLoginModal);
  btnCancelAdminLogin.addEventListener('click', closeAdminLoginModal);
  adminLoginForm.addEventListener('submit', handleAdminLoginSubmit);

  // Toggle Admin Password Visibility
  btnTogglePassword.addEventListener('click', () => {
    const isPassword = adminPasswordInput.type === 'password';
    adminPasswordInput.type = isPassword ? 'text' : 'password';
    btnTogglePassword.innerHTML = `<i class="fa-solid fa-${isPassword ? 'eye-slash' : 'eye'}"></i>`;
  });

  // Export & Import Buttons
  btnExportData.addEventListener('click', exportDataJSON);
  btnImportData.addEventListener('click', () => importFileInput.click());
  importFileInput.addEventListener('change', importDataJSON);

  // Search Events
  searchInput.addEventListener('input', render);
  btnClearSearch.addEventListener('click', () => {
    searchInput.value = '';
    render();
    searchInput.focus();
  });

  // Modal Buttons
  btnAddProduct.addEventListener('click', openAddModal);
  btnEmptyAdd.addEventListener('click', openAddModal);
  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);

  // Form submit
  productForm.addEventListener('submit', handleFormSubmit);

  // Price Live Preview Hint
  productPriceInput.addEventListener('input', (e) => {
    updatePriceHint(e.target.value);
  });

  // Image Tabs
  tabUpload.addEventListener('click', () => switchTab('upload'));
  tabUrl.addEventListener('click', () => switchTab('url'));

  // URL Image Preview Input
  productImageUrlInput.addEventListener('input', (e) => {
    setPreviewImage(e.target.value);
  });

  // Image File Reader (Base64)
  productImageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Kích thước ảnh quá lớn (vui lòng chọn ảnh nhỏ hơn 5MB)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        editingImageBase64 = evt.target.result;
        setPreviewImage(editingImageBase64);
      };
      reader.readAsDataURL(file);
    }
  });

  // Delete Modal Buttons
  btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
  btnCancelDelete.addEventListener('click', closeDeleteModal);
  btnConfirmDelete.addEventListener('click', confirmDelete);

  // Close modals when clicking background
  window.addEventListener('click', (e) => {
    if (e.target === productModal) closeModal();
    if (e.target === deleteModal) closeDeleteModal();
    if (e.target === adminLoginModal) closeAdminLoginModal();
  });
}

// Global functions for inline onclick handlers
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
window.toggleOutOfStock = toggleOutOfStock;

// Run App
document.addEventListener('DOMContentLoaded', initApp);
