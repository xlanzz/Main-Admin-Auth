# 🚀 BotWA Admin Panel

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![Next.js](https://img.shields.io/badge/next.js-15.x-black)

Admin panel untuk BotWA dengan autentikasi JWT, MongoDB, dan Next.js. Platform ini memungkinkan admin mengelola bot WhatsApp dengan antarmuka yang intuitif dan responsif.

![BotWA Admin Panel Preview](https://via.placeholder.com/1200x600?text=BotWA+Admin+Panel)

## ✨ Fitur Utama

- 🔐 **Autentikasi Aman**: Sistem JWT dengan manajemen token dan sesi
- 👥 **Manajemen Admin**: Role superadmin dan admin dengan hak akses berbeda
- 🌓 **Tema Gelap & Terang**: Tampilan aplikasi yang dapat disesuaikan
- 📱 **Responsif**: Desain yang bekerja dengan sempurna di desktop, tablet, dan mobile
- 🧩 **Komponen Modular**: Arsitektur yang mudah diperluas dan dikustomisasi

## 🛠️ Teknologi

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB dengan Mongoose
- **Autentikasi**: JWT (JSON Web Tokens)
- **Styling**: TailwindCSS, ShadCN UI
- **Deployment**: Vercel

## 🚀 Cara Memulai

### Prasyarat

- Node.js 18.x atau lebih baru
- npm 9.x atau lebih baru
- MongoDB (dapat menggunakan Atlas untuk cloud atau lokal)

### Langkah Instalasi

1. **Clone Repository**

   ```bash
   git clone https://github.com/wahdalo/panel-vercel.git
   cd panel-vercel
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Salin file contoh environment:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` dan sesuaikan dengan pengaturan Anda:
   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/botwa?retryWrites=true&w=majority
   JWT_SECRET=your-secure-jwt-secret-key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Jalankan Development Server**

   ```bash
   npm run dev
   ```

   Server akan berjalan di [http://localhost:3000](http://localhost:3000)

5. **Buat Superadmin**

   Buat akun superadmin pertama:
   ```bash
   npm run create-superadmin
   ```
   
   Ini akan membuat pengguna dengan:
   - Username: `superadmin`
   - Email: `superadmin@example.com` 
   - Password: `Admin123!`
   
   **PENTING**: Ubah password default segera setelah login pertama!

## 📋 Struktur Aplikasi

```
src/
├── app/              # Next.js App Router
│   ├── api/          # API routes/endpoints
│   ├── dashboard/    # Dashboard & admin pages
│   ├── login/        # Auth & login pages
├── components/       # Reusable React components
├── context/          # React Context providers
├── lib/              # Utility functions
├── models/           # Mongoose models
```

## 🖥️ Panel Dashboard

Setelah login, Anda akan melihat panel admin dengan fitur berikut:

- **Dashboard**: Overview statistik dan metrik utama
- **Pengguna**: Kelola admin dan superadmin
- **Pengaturan**: Konfigurasi aplikasi dan preferensi

### Role dan Hak Akses

- **Superadmin**: Akses penuh ke semua fitur, dapat membuat admin baru
- **Admin**: Akses terbatas, tidak dapat membuat admin baru

## 🌙 Dukungan Dark Mode

Aplikasi mendukung tema gelap yang dapat diubah melalui:
- Toggle di bagian header aplikasi
- Halaman Settings di tab Appearance

## 📱 Responsif di Berbagai Perangkat

Interface aplikasi dioptimalkan untuk bekerja di:
- Desktop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔄 API Endpoints

Berikut adalah beberapa endpoint API utama:

- **POST /api/auth/login** - Login dan mendapatkan JWT token
- **GET /api/auth/me** - Mendapatkan data admin saat ini
- **POST /api/auth/logout** - Logout dan invalidasi token
- **GET /api/admin/users** - Mendapatkan daftar admin
- **POST /api/admin/users** - Membuat admin baru (hanya superadmin)

## 🚀 Deployment ke Vercel

### Menggunakan Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login ke Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Deployment production:
   ```bash
   vercel --prod
   ```

### Via Dashboard Vercel

1. Push repo ke GitHub
2. Connect repo di [Vercel Dashboard](https://vercel.com)
3. Konfigurasi environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy!

## 🧪 Testing

```bash
# Menjalankan unit tests
npm test

# Menjalankan linter
npm run lint
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk detail tentang:

- Proses untuk membuka issues
- Proses pull request
- Panduan coding
- Alur kerja development

## 📄 Lisensi

Project ini dilisensikan di bawah lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## 📬 Kontak

Jika Anda memiliki pertanyaan atau saran, silakan buka issue di repository ini.

---

Dibuat dengan ❤️ oleh [Wahdalo](https://github.com/wahdalo)
