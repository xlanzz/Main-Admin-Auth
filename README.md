# 🚀 Admin Panel

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![Next.js](https://img.shields.io/badge/next.js-15.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-blue.svg)

Admin panel dengan autentikasi JWT, MongoDB, dan Next.js. Platform ini memungkinkan admin mengelola dengan antarmuka yang intuitif dan responsif.

![Admin Panel Preview](image.png)

## 📑 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#️-teknologi)
- [Arsitektur](#-arsitektur)
- [Cara Memulai](#-cara-memulai)
- [Struktur Aplikasi](#-struktur-aplikasi)
- [Panel Dashboard](#️-panel-dashboard)
- [Manajemen Auth](#-manajemen-autentikasi)
- [UI/UX](#-uiux)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment-ke-vercel)
- [Testing](#-testing)
- [Optimasi Performa](#-optimasi-performa)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)
- [Kontak](#-kontak)

## ✨ Fitur Utama

- 🔐 **Autentikasi Aman**: 
  - Sistem JWT dengan manajemen token dan sesi
  - Refresh token untuk pengalaman yang lebih baik
  - Proteksi rute berdasarkan role
  - Timeout sesi yang dapat dikonfigurasi

- 👥 **Manajemen Admin**: 
  - Role superadmin dan admin dengan hak akses berbeda
  - Manajemen profil pengguna
  - Reset password dan pemulihan akun
  - Log aktivitas admin

- 🌓 **Tema Gelap & Terang**: 
  - Tampilan aplikasi yang dapat disesuaikan
  - Penyimpanan preferensi di localStorage
  - Auto-detect preferensi sistem

- 📊 **Dashboard Analytics**:
  - Visualisasi data real-time
  - Metrik kinerja yang dapat disesuaikan
  - Ekspor data dalam berbagai format

- 📱 **Responsif**: 
  - Desain yang bekerja dengan sempurna di desktop, tablet, dan mobile
  - Optimasi untuk ukuran layar berbeda
  - Pengalaman pengguna yang konsisten

- 🧩 **Komponen Modular**: 
  - Arsitektur yang mudah diperluas dan dikustomisasi
  - Komponen UI yang reusable
  - Pemisahan logika bisnis dan presentasi

- 🔄 **State Management**:
  - Penggunaan React Context API
  - Persistent state dengan localStorage
  - Server state management

## 🛠️ Teknologi

### Frontend
- **Framework**: Next.js 15, React 19
- **Styling**: TailwindCSS 3.x, ShadCN UI
- **State Management**: React Context API, SWR untuk data fetching
- **Forms**: React Hook Form, Zod untuk validasi

### Backend
- **Server**: Next.js API Routes dengan Edge Runtime
- **Database**: MongoDB dengan Mongoose ODM
- **Caching**: Next.js ISR dan SWR
- **Autentikasi**: JWT (JSON Web Tokens) dengan rotasi token

### DevOps
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Environment**: Docker untuk development lokal
- **Monitoring**: Vercel Analytics

### Testing
- **Unit Testing**: Jest
- **E2E Testing**: Cypress
- **API Testing**: Supertest

## 🏗 Arsitektur

### Sistem Autentikasi
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│    Client   │────▶│ Auth Server │────▶│  Database   │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  JWT Token  │     │ Auth Cookie │
│ (short-live)│     │ (refresh)   │
└─────────────┘     └─────────────┘
```

### Alur Data
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│ React UI    │────▶│ API Routes  │────▶│  MongoDB    │
│ Components  │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                   │
       │                   │
       └───────────────────┘
            SWR Cache
```

## 🚀 Cara Memulai

### Prasyarat

- Node.js 18.x atau lebih baru
- npm 9.x atau lebih baru
- MongoDB (dapat menggunakan Atlas untuk cloud atau lokal)
- Git

### Langkah Instalasi Detail

1. **Clone Repository**

   ```bash
   git clone https://github.com/wahdalo/panel-vercel.git
   cd panel-vercel
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

   Atau jika menggunakan pnpm:
   ```bash
   pnpm install
   ```

3. **Setup Environment Variables**

   Salin file contoh environment:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` dan sesuaikan dengan pengaturan Anda:
   ```
   # Database
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/adminpanel?retryWrites=true&w=majority
   
   # Authentication
   JWT_SECRET=your-secure-jwt-secret-key
   JWT_EXPIRES_IN=1d
   REFRESH_TOKEN_SECRET=another-secure-secret-for-refresh
   REFRESH_TOKEN_EXPIRES_IN=7d
   
   # Application
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=Admin Panel
   
   # Email (opsional)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-user
   SMTP_PASSWORD=your-smtp-password
   SMTP_FROM_EMAIL=noreply@example.com
   ```

4. **Setup Database**

   a. Menggunakan MongoDB Atlas:
   - Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Buat cluster baru
   - Buat database user
   - Whitelist IP Anda (0.0.0.0/0 untuk akses dari mana saja)
   - Dapatkan connection string dan masukkan ke .env.local

   b. MongoDB Lokal:
   - Install MongoDB di komputer lokal
   - Jalankan MongoDB service
   - Update MONGODB_URI di .env.local dengan `mongodb://localhost:27017/adminpanel`

5. **Inisialisasi Database**

   ```bash
   npm run db:seed
   ```

   Ini akan membuat koleksi awal dan data contoh di database Anda.

6. **Jalankan Development Server**

   ```bash
   npm run dev
   ```

   Server akan berjalan di [http://localhost:3000](http://localhost:3000)

7. **Buat Superadmin**

   Buat akun superadmin pertama:
   ```bash
   npm run create-superadmin
   ```
   
   Ini akan membuat pengguna dengan:
   - Username: `superadmin`
   - Email: `superadmin@example.com` 
   - Password: `Admin123!`
   
   **PENTING**: Ubah password default segera setelah login pertama!

8. **Akses Panel Admin**

   Buka browser dan akses [http://localhost:3000/login](http://localhost:3000/login)
   
   Login menggunakan kredensial superadmin yang dibuat pada langkah sebelumnya.

## 📋 Struktur Aplikasi

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes/endpoints
│   │   ├── auth/             # Authentication endpoints
│   │   │   ├── login/        # Login API
│   │   │   ├── logout/       # Logout API
│   │   │   ├── me/           # Current user API
│   │   │   └── refresh/      # Token refresh API
│   │   ├── admin/            # Admin management API
│   │   └── [other domains]/  # Other domain-specific APIs
│   ├── dashboard/            # Dashboard & admin pages
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── page.tsx          # Main dashboard page
│   │   ├── users/            # User management pages
│   │   │   ├── page.tsx      # User listing page
│   │   │   └── [id]/         # User detail pages
│   │   └── settings/         # Application settings
│   ├── login/                # Auth & login pages
│   │   └── page.tsx          # Login page
│   └── layout.tsx            # Root layout
├── components/               # Reusable React components
│   ├── auth/                 # Authentication-related components
│   ├── common/               # Common UI components
│   ├── dashboard/            # Dashboard-specific components
│   ├── forms/                # Form components
│   ├── layout/               # Layout components
│   └── ui/                   # UI primitives
├── context/                  # React Context providers
│   ├── auth-context.tsx      # Authentication context
│   └── theme-context.tsx     # Theme context
├── hooks/                    # Custom React hooks
│   ├── use-auth.ts           # Authentication hook
│   ├── use-theme.ts          # Theme hook
│   └── use-toast.ts          # Toast notification hook
├── lib/                      # Utility functions
│   ├── api/                  # API utilities
│   ├── auth/                 # Auth utilities
│   ├── db/                   # Database utilities
│   └── validators/           # Form validation schemas
├── models/                   # Mongoose models
│   ├── user.model.ts         # User model
│   └── [other models].ts     # Other domain models
├── types/                    # TypeScript types
├── middleware.ts             # Next.js middleware (auth, etc.)
└── utils/                    # Helper utilities
```

## 🖥️ Panel Dashboard

### Tata Letak dan Navigasi

Dashboard dirancang dengan prinsip UI/UX terbaik:
- **Sidebar**: Navigasi utama dengan kategori yang dikelompokkan
- **Header**: User profile, notifikasi, dark mode toggle
- **Content Area**: Area utama dengan breadcrumbs dan responsive layout
- **Footer**: Informasi versi dan copyright

### Modul Utama

- **Dashboard**: 
  - Overview statistik dan metrik utama
  - Grafik performa real-time
  - Widget yang dapat dikustomisasi
  - Notifikasi sistem

- **Pengguna**: 
  - Kelola admin dan superadmin
  - Filter dan pencarian lanjutan
  - Bulk operations
  - Log aktivitas pengguna

- **Pengaturan**: 
  - Konfigurasi aplikasi dan preferensi
  - Manajemen profil
  - Keamanan dan password
  - Preferensi notifikasi

### Role dan Hak Akses

Sistem menggunakan Role-Based Access Control (RBAC):

| Fitur | Superadmin | Admin |
|-------|------------|-------|
| Dashboard | ✅ | ✅ |
| Lihat Pengguna | ✅ | ✅ |
| Tambah Pengguna | ✅ | ❌ |
| Edit Pengguna | ✅ | ❌ |
| Hapus Pengguna | ✅ | ❌ |
| Pengaturan Sistem | ✅ | ❌ |
| Pengaturan Profil | ✅ | ✅ |

## 🔐 Manajemen Autentikasi

### Alur Autentikasi

1. **Login**:
   - User memasukkan email/username dan password
   - Server memvalidasi kredensial
   - Server menghasilkan JWT token dan refresh token
   - Token dikirim ke client (JWT di memory, refresh token di HTTP-only cookie)

2. **Autentikasi Request**:
   - Setiap request API menyertakan JWT token di header Authorization
   - Server memvalidasi token untuk setiap request
   - Middleware memverifikasi hak akses berdasarkan role

3. **Refresh Token**:
   - JWT token kedaluwarsa (biasanya setelah 24 jam)
   - Client menggunakan refresh token untuk mendapatkan JWT baru
   - Refresh token dirotasi untuk keamanan tambahan

4. **Logout**:
   - JWT token dihapus dari memory client
   - Refresh token diinvalidasi di server
   - Cookies dihapus

### Keamanan

- Password di-hash menggunakan bcrypt
- Proteksi terhadap brute force dengan rate limiting
- CSRF protection dengan token
- Enkripsi data sensitif
- Validasi input dengan Zod

## 💅 UI/UX

### Tema dan Styling

Aplikasi menggunakan pendekatan design system dengan:
- **Color palette**: Variabel CSS untuk konsistensi
- **Typography**: Hirarki font yang jelas
- **Spacing**: Sistem spacing yang konsisten
- **Components**: Library komponen yang reusable

### Dark Mode & Light Mode

![Light Mode](light-mode.png) ![Dark Mode](dark-mode.png)

- Toggle di bagian header aplikasi
- Penyimpanan preferensi di localStorage
- Auto-detect preferensi sistem

### Responsivitas

Aplikasi dioptimalkan untuk berbagai perangkat:
- **Desktop** (1024px+): Layout penuh dengan sidebar
- **Tablet** (768px+): Layout yang dioptimalkan dengan collapsed sidebar
- **Mobile** (320px+): Mobile-first design dengan navigasi bottom bar

## 🔄 API Endpoints

### Authentication

```
POST /api/auth/login           - Login dan mendapatkan JWT token
POST /api/auth/logout          - Logout dan invalidasi token
GET  /api/auth/me              - Mendapatkan data admin saat ini
POST /api/auth/refresh         - Refresh JWT token
POST /api/auth/password/reset  - Permintaan reset password
```

### User Management

```
GET    /api/admin/users        - Mendapatkan daftar admin
POST   /api/admin/users        - Membuat admin baru (hanya superadmin)
GET    /api/admin/users/:id    - Mendapatkan detail admin
PUT    /api/admin/users/:id    - Memperbarui admin
DELETE /api/admin/users/:id    - Menghapus admin (hanya superadmin)
```

### Dashboard & Analytics

```
GET /api/dashboard/stats       - Mendapatkan statistik dashboard
GET /api/dashboard/activities  - Mendapatkan log aktivitas
```

### Settings

```
GET  /api/settings             - Mendapatkan pengaturan aplikasi
POST /api/settings             - Memperbarui pengaturan aplikasi
```

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

3. Deploy untuk preview:
   ```bash
   vercel
   ```

4. Deployment production:
   ```bash
   vercel --prod
   ```

### Via Dashboard Vercel

1. Push repo ke GitHub/GitLab/Bitbucket
2. Connect repo di [Vercel Dashboard](https://vercel.com)
3. Konfigurasi environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `REFRESH_TOKEN_SECRET`
   - dll.
4. Konfigurasi build command & output directory (biasanya otomatis)
5. Deploy!

### Custom Domain

1. Tambahkan domain di dashboard Vercel
2. Ikuti instruksi untuk setting up DNS
3. Tunggu propagasi DNS dan verifikasi

## 🧪 Testing

### Unit Testing

```bash
# Menjalankan unit tests
npm test

# Menjalankan unit tests dengan coverage
npm test -- --coverage
```

### E2E Testing

```bash
# Menjalankan Cypress tests dalam mode headless
npm run test:e2e

# Menjalankan Cypress tests dengan UI
npm run cypress:open
```

### Linting & Formatting

```bash
# Menjalankan linter
npm run lint

# Memperbaiki masalah lint yang dapat diperbaiki otomatis
npm run lint:fix

# Format kode dengan Prettier
npm run format
```

## 🚀 Optimasi Performa

### Frontend Optimization

- **Code Splitting**: Implementasi otomatis dengan Next.js
- **Image Optimization**: Next.js Image untuk optimasi gambar
- **Bundle Size Analysis**: Penggunaan `@next/bundle-analyzer`
- **Lazy Loading**: Komponen dan rute dimuat secara lazy

### Backend Optimization

- **API Response Caching**: Implementasi SWR untuk caching
- **Database Indexes**: MongoDB indexes untuk query yang cepat
- **Rate Limiting**: Proteksi API dari overload
- **Pagination**: Semua endpoint list mengimplementasikan pagination

## 🔧 Troubleshooting

### Masalah Umum

1. **MongoDB Connection Error**
   - Periksa string koneksi di .env.local
   - Pastikan IP Anda di whitelist di MongoDB Atlas
   - Periksa firewall untuk koneksi lokal

2. **JWT Issues**
   - Pastikan JWT_SECRET diset
   - Periksa waktu server (JWT sensitif terhadap waktu)
   - Refresh token jika JWT kedaluwarsa

3. **UI Rendering Issues**
   - Clear browser cache
   - Periksa error di console browser
   - Restart dev server

### Logs

Development logs tersedia di:
- Terminal saat menjalankan `npm run dev`
- Browser console untuk client-side errors
- `/api/debug/logs` endpoint (hanya untuk superadmin)

## 🗓 Roadmap

### Short Term (1-3 bulan)
- Implementasi notifikasi real-time
- Penambahan dashboard charts lanjutan
- Implementasi export data ke PDF/Excel

### Medium Term (3-6 bulan)
- Integrasi dengan layanan eksternal
- Mobile app companion
- Multi-language support

### Long Term (6+ bulan)
- White-label solution
- Marketplace untuk plugins
- Enterprise features

## 🤝 Kontribusi

Kontribusi sangat diterima! Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk detail tentang:

- Proses untuk membuka issues
- Proses pull request
- Panduan coding
- Alur kerja development

### Development Workflow

1. Fork repository
2. Buat branch baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

## 📄 Lisensi

Project ini dilisensikan di bawah lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## 📊 Manajemen Database

### Skema dan Model

Aplikasi menggunakan MongoDB dengan Mongoose sebagai ODM (Object Document Mapper) untuk mendefinisikan dan mengelola data.

### Relasi Antar Model

Aplikasi menggunakan referensi MongoDB untuk mengatur relasi antar model:

```
                    ┌───────────┐
                    │           │
                 ┌─▶│  Account  │◀─┐
                 │  │           │  │
                 │  └───────────┘  │
                 │                 │
┌───────────┐    │  ┌───────────┐  │    ┌───────────┐
│           │    │  │           │  │    │           │
│    User   │────┴─▶│ Activity  │◀─┴────│  Setting  │
│           │       │    Log    │       │           │
└───────────┘       │           │       └───────────┘
                    └───────────┘
```

### Operasi Database

#### Manajemen User

Aplikasi menyediakan interface untuk:

1. **Pencarian dan Filter Users**:
   - Mencari berdasarkan nama/email/username
   - Filter berdasarkan role, status aktivitas
   - Pagination untuk hasil pencarian

2. **CRUD Operations**:
   - Create: Superadmin dapat membuat admin baru
   - Read: Melihat detail dan daftar admin
   - Update: Mengubah profil, role, dan status
   - Delete: Menonaktifkan atau menghapus admin

3. **Reset Password dan Manajemen Akses**:
   - Fitur lupa password
   - Reset password oleh superadmin
   - Revokasi akses sementara atau permanen

#### Manajemen Account

Fitur pengelolaan account meliputi:

1. **Pencarian dan Klasifikasi**:
   - Mencari account berdasarkan nama/email
   - Filter berdasarkan tipe, status, tanggal dibuat
   - Pengurutan berdasarkan berbagai atribut

2. **Operasi Account**:
   - Pendaftaran account baru
   - Pengeditan informasi account
   - Perubahan status (aktivasi/penangguhan)
   - Pengelolaan pengaturan account

3. **Relasi User-Account**:
   - Menambahkan admin ke account
   - Mengatur permission per-account
   - Rotasi admin yang mengelola account

### Keamanan Database

Sistem mengimplementasikan praktik keamanan database:

1. **Perlindungan Data Sensitif**:
   - Password di-hash menggunakan bcrypt
   - Enkripsi data sensitif
   - Masking data personal dalam log

2. **Validasi Data**:
   - Mongoose schema validation
   - Zod untuk validasi data dari client
   - Sanitasi input untuk mencegah NoSQL injection

3. **Backup dan Recovery**:
   - Backup otomatis database
   - Strategi point-in-time recovery
   - Prosedur recovery data dari backup

### Database Migration

Untuk perubahan skema dan migrasi data, aplikasi menggunakan:

1. **Versioning Schema**:
   - Mongoose plugin untuk schema versioning
   - Migrasi otomatis saat startup

2. **Scripts Migrasi**:
   - Toolkit untuk migrasi manual
   - Script untuk migrasi data massal

### Performance Optimization

Untuk mengoptimalkan performa database:

1. **Indexing**:
   - Index pada field pencarian (username, email)
   - Compound index untuk query yang sering digunakan
   - TTL index untuk data sementara

2. **Caching**:
   - Redis untuk caching query yang sering diakses
   - SWR di frontend untuk mengurangi beban server
   - Cache invalidation strategy

3. **Query Optimization**:
   - Projection untuk membatasi field yang diambil
   - Pagination untuk dataset besar
   - Agregasi untuk complex query

Jika Anda memiliki pertanyaan atau saran, silakan buka issue di repository ini.

---

Dibuat dengan ❤️ oleh [Wahdalo](https://github.com/wahdalo)
