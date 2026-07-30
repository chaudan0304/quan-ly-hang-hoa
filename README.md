# 📦 Ứng Dụng Quản Lý Hàng Hóa (Giá & Hình Ảnh)

Trang web quản lý hàng hóa tối giản, hiện đại và tiện lợi giúp ghi lại giá tiền và hình ảnh minh họa cho từng mặt hàng. Dữ liệu được lưu trữ tự động trên thiết bị của bạn (`LocalStorage`), không lo bị mất khi làm mới trang.

---

## ✨ Tính Năng Chính

1. **Ghi lại giá tiền & hình ảnh minh họa**: Hiển thị thẻ hàng hóa trực quan với giá tiền định dạng VNĐ chuẩn (`15.000.000 đ`).
2. **Chỉnh sửa linh hoạt**:
   - Dễ dàng thay đổi giá tiền và tên hàng hóa.
   - Thay đổi hình ảnh bằng cách **tải ảnh từ máy** (hỗ trợ JPG, PNG, WEBP) hoặc **dán đường dẫn URL**.
3. **Tìm kiếm hàng hóa tức thì**: Thanh tìm kiếm thông minh tự động lọc danh sách theo tên hàng hóa ngay khi bạn nhập từ khóa.
4. **Lưu trữ LocalStorage**: Dữ liệu lưu trực tiếp trên trình duyệt, không cần cơ sở dữ liệu hay server phức tạp.

---

## 🚀 Hướng Dẫn Đẩy Web Lên GitHub Pages (Miễn phí 100%)

### Bước 1: Tạo Git Repository & Commit code
Mở Terminal tại thư mục project (`d:\quan-ly-hang-hoa`) và chạy các lệnh sau:
```bash
git init
git add .
git commit -m "Initial commit - Quan ly hang hoa app"
```

### Bước 2: Tạo Repository trên GitHub & Push code lên
1. Truy cập [GitHub New Repo](https://github.com/new) và tạo một repository mới (ví dụ: `quan-ly-hang-hoa`).
2. Chạy lệnh đẩy code lên GitHub:
```bash
git branch -M main
git remote add origin https://github.com/<USERNAME_CUAT_BAN>/quan-ly-hang-hoa.git
git push -u origin main
```

### Bước 3: Bật tính năng GitHub Pages
1. Vào repository của bạn trên GitHub -> chọn tab **Settings**.
2. Chọn mục **Pages** ở thanh menu bên trái.
3. Tại phần **Build and deployment** -> mục **Source** chọn **Deploy from a branch**.
4. Mục **Branch** chọn `main` và thư mục `/ (root)` -> Bấm **Save**.
5. Đợi khoảng 1-2 phút, trang web của bạn sẽ hoạt động tại địa chỉ:  
   `https://<USERNAME_CUA_BAN>.github.io/quan-ly-hang-hoa/`

---

## ⚡ Hướng Dẫn Đẩy Web Lên Vercel (Cực nhanh)

### Cách 1: Deploy qua Giao diện Web Vercel
1. Đẩy mã nguồn lên GitHub (theo Bước 1 & 2 ở trên).
2. Truy cập [Vercel Dashboard](https://vercel.com/dashboard) và đăng nhập.
3. Bấm **Add New...** -> chọn **Project**.
4. Chọn repository `quan-ly-hang-hoa` vừa tải lên và bấm **Import**.
5. Giữ nguyên mặc định và bấm **Deploy**. Sau vài giây, Vercel sẽ cấp link trang web công khai (ví dụ: `quan-ly-hang-hoa.vercel.app`).

### Cách 2: Deploy trực tiếp bằng Vercel CLI
Nếu bạn đã cài Vercel CLI, chỉ cần chạy 1 lệnh duy nhất tại thư mục dự án:
```bash
npx vercel
```
Bấm `Enter` chấp nhận các thiết lập mặc định, trang web sẽ được deploy ngay lập tức!

---

## 🛠 Công Nghệ Sử Dụng
- **Core**: HTML5, CSS3 Vanilla (Modern CSS Grid & Flexbox), ES6 JavaScript.
- **UI/UX**: Google Fonts (Inter & Outfit), FontAwesome Icons, Glassmorphism Card Theme.
- **Storage**: Browser LocalStorage.
