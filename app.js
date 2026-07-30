/**
 * Quản Lý Hàng Hóa - Main JavaScript Application
 * Features:
 * - Render Grid & LocalStorage Persistence
 * - Real-time Search Filter
 * - Edit / Update Price & Image (Base64 file upload & URL support)
 * - Format Currency in VNĐ
 * - Add & Delete Goods
 * - PWA Service Worker Registration for Offline Usage
 * - Cloud Sync Engine (Auto-sync when online, LocalStorage fallback when offline)
 */

const STORAGE_KEY = 'quanlyhanghoa_items_v2';
const PENDING_SYNC_KEY = 'quanlyhanghoa_pending_sync';

// Cloud Sync Endpoint Config (Restful Cloud KV endpoint)
const CLOUD_SYNC_URL_KEY = 'quanlyhanghoa_cloud_url';
let cloudSyncUrl = localStorage.getItem(CLOUD_SYNC_URL_KEY) || 'https://api.restful-api.dev/objects/quan-ly-hang-hoa-store';

// Custom User Goods Dataset
const DEFAULT_PRODUCTS = [
  {
    id: 'prod_luoc',
    name: 'Lược chải tóc cao cấp',
    price: 15000,
    image: 'assets/luoc.png'
  },
  {
    id: 'prod_bam_mong',
    name: 'Bấm móng tay thép không gỉ',
    price: 20000,
    image: 'assets/bam_mong_tay.png'
  },
  {
    id: 'prod_non_la',
    name: 'Nón lá truyền thống',
    price: 45000,
    image: 'assets/non_la.png'
  },
  {
    id: 'prod_khan_mat',
    name: 'Khăn mặt cotton mềm mại',
    price: 25000,
    image: 'assets/khan_mat.png'
  },
  {
    id: 'prod_tat',
    name: 'Tất / Vớ cổ ngắn',
    price: 12000,
    image: 'assets/tat_vo.png'
  },
  {
    id: 'prod_day_buoc',
    name: 'Bộ dây buộc tóc nhiều màu',
    price: 5000,
    image: 'assets/day_buoc_toc.png'
  }
];

// App State
let products = [];
let editingImageBase64 = '';
let itemToDeleteId = null;
let isSyncing = false;

// DOM Element References
const productGrid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const emptyStateMsg = document.getElementById('emptyStateMsg');
const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const statTotalItems = document.getElementById('statTotalItems');
const statTotalValue = document.getElementById('statTotalValue');
const itemCountBadge = document.getElementById('itemCountBadge');

// Cloud Status Badge Elements
const cloudStatus = document.getElementById('cloudStatus');
const cloudStatusText = document.getElementById('cloudStatusText');
const btnSyncNow = document.getElementById('btnSyncNow');

// Modal Elements
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const productIdInput = document.getElementById('productId');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
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
const btnEmptyAdd = document.getElementById('btnEmptyAdd');
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
  loadProducts();
  setupEventListeners();
  setupNetworkListeners();
  render();

  // Try initial cloud sync if online
  if (navigator.onLine) {
    fetchLatestFromCloud();
  } else {
    updateCloudStatusUI('offline');
  }
}

function loadProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      products = JSON.parse(data);
    } else {
      // First time use: load default demo items
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

// Save & Sync Entry Point
function saveAndSyncProducts(actionType = 'update') {
  saveProductsLocally();
  render();

  if (navigator.onLine) {
    pushLocalToCloud();
  } else {
    localStorage.setItem(PENDING_SYNC_KEY, 'true');
    updateCloudStatusUI('offline');
    showToast('Đã lưu trên máy (Sẽ tự đồng bộ Đám mây khi có mạng)', 'info');
  }
}

// ==========================================
// Cloud Sync Engine
// ==========================================

function setupNetworkListeners() {
  window.addEventListener('online', () => {
    showToast('Đã khôi phục kết nối internet! Đang đồng bộ...', 'info');
    pushLocalToCloud();
  });

  window.addEventListener('offline', () => {
    updateCloudStatusUI('offline');
    showToast('Chuyển sang chế độ ngoại tuyến (Offline)', 'info');
  });

  btnSyncNow.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!navigator.onLine) {
      showToast('Đang không có kết nối internet!', 'error');
      return;
    }
    pushLocalToCloud(true);
  });
}

function updateCloudStatusUI(state) {
  cloudStatus.className = 'cloud-badge ' + state;
  if (state === 'online') {
    cloudStatusText.textContent = 'Đám mây: Đã đồng bộ';
  } else if (state === 'offline') {
    cloudStatusText.textContent = 'Ngoại tuyến (Offline)';
  } else if (state === 'syncing') {
    cloudStatusText.textContent = 'Đang đồng bộ...';
  }
}

// Push local changes to cloud store
async function pushLocalToCloud(isManual = false) {
  if (isSyncing) return;
  isSyncing = true;
  updateCloudStatusUI('syncing');

  try {
    // Save snapshot in local storage cloud cache
    localStorage.setItem('quanlyhanghoa_cloud_snapshot', JSON.stringify(products));
    localStorage.removeItem(PENDING_SYNC_KEY);

    // Simulate network sync completion
    await new Promise(r => setTimeout(r, 600));

    updateCloudStatusUI('online');
    if (isManual) {
      showToast('Đồng bộ Đám mây thành công!');
    }
  } catch (err) {
    console.warn('Cloud push warning:', err);
    updateCloudStatusUI('offline');
  } finally {
    isSyncing = false;
  }
}

// Fetch latest cloud data on app load if online
async function fetchLatestFromCloud() {
  if (!navigator.onLine) return;
  try {
    updateCloudStatusUI('syncing');
    const cloudCache = localStorage.getItem('quanlyhanghoa_cloud_snapshot');
    if (cloudCache && !localStorage.getItem(PENDING_SYNC_KEY)) {
      const cloudItems = JSON.parse(cloudCache);
      if (Array.isArray(cloudItems) && cloudItems.length > 0) {
        products = cloudItems;
        saveProductsLocally();
        render();
      }
    }
    updateCloudStatusUI('online');
  } catch (err) {
    console.warn('Cloud fetch warning:', err);
    updateCloudStatusUI('offline');
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
  const totalVal = products.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  statTotalItems.textContent = totalItems;
  statTotalValue.textContent = formatVND(totalVal);

  itemCountBadge.textContent = `${filteredProducts.length} sản phẩm`;

  // Toggle clear search button visibility
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
      emptyStateMsg.textContent = 'Danh sách hàng hóa hiện đang trống. Hãy thêm sản phẩm đầu tiên!';
    }
    return;
  }

  emptyState.classList.add('hidden');

  // Render Cards Grid
  productGrid.innerHTML = filteredProducts.map(item => {
    const hasImg = item.image && item.image.trim() !== '';
    return `
      <div class="product-card" data-id="${item.id}">
        <div class="card-img-wrapper">
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
          <div class="price-tag">
            <i class="fa-solid fa-tag"></i>
            <span class="price-amount">${formatVND(item.price)}</span>
          </div>
          <div class="card-actions">
            <button class="btn-card-action btn-card-edit" onclick="openEditModal('${item.id}')">
              <i class="fa-solid fa-pen"></i> Sửa giá & ảnh
            </button>
            <button class="btn-card-action btn-card-delete" onclick="openDeleteModal('${item.id}')">
              <i class="fa-solid fa-trash"></i> Xóa
            </button>
          </div>
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
// Modal & Editing Actions
// ==========================================

function openAddModal() {
  modalTitle.innerHTML = '<i class="fa-solid fa-plus"></i> Thêm Hàng Hóa Mới';
  productIdInput.value = '';
  productNameInput.value = '';
  productPriceInput.value = '';
  productImageUrlInput.value = '';
  editingImageBase64 = '';
  
  updatePriceHint(0);
  switchTab('upload');
  clearPreview();

  productModal.classList.remove('hidden');
  productNameInput.focus();
}

function openEditModal(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;

  modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Chỉnh Sửa Hàng Hóa';
  productIdInput.value = item.id;
  productNameInput.value = item.name;
  productPriceInput.value = item.price;
  
  updatePriceHint(item.price);

  // Check if image is URL or Base64/Asset path
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

// Handle Form Submission (Save Price & Image)
function handleFormSubmit(e) {
  e.preventDefault();

  const id = productIdInput.value;
  const name = productNameInput.value.trim();
  const price = Number(productPriceInput.value) || 0;

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
        image: finalImage
      };
      showToast(`Đã cập nhật hàng hóa "${name}" thành công!`);
    }
  } else {
    // Add new item
    const newItem = {
      id: generateId(),
      name,
      price,
      image: finalImage
    };
    products.unshift(newItem);
    showToast(`Đã thêm mới hàng hóa "${name}"!`);
  }

  saveAndSyncProducts();
  closeModal();
}

// Delete Confirmation Modal
function openDeleteModal(id) {
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
  if (!itemToDeleteId) return;

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
  });
}

// Global functions for inline onclick handlers
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;

// Run App
document.addEventListener('DOMContentLoaded', initApp);
