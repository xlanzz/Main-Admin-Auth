# Panduan Kontribusi

Terima kasih telah mempertimbangkan untuk berkontribusi pada Admin Panel! Kami sangat menghargai bantuan Anda.

## Cara Berkontribusi

1. Fork repositori ini
2. Clone fork Anda (`git clone https://github.com/username_anda/admin-panel.git`)
3. Buat branch fitur baru (`git checkout -b feature/fitur-luar-biasa`)
4. Commit perubahan Anda (`git commit -am 'Menambahkan fitur luar biasa'`)
5. Push ke branch (`git push origin feature/fitur-luar-biasa`)
6. Buat Pull Request baru

## Standar Kode

### JavaScript/TypeScript
- Gunakan TypeScript untuk semua kode baru
- Gunakan ESLint untuk memastikan kode yang bersih
- Ikuti konvensi penamaan camelCase untuk variabel dan fungsi, PascalCase untuk komponen React

### React/Next.js
- Gunakan React Function Components dengan hooks
- Pastikan semua komponen memiliki JSDoc yang menjelaskan props dan fungsionalitasnya
- Gunakan struktur client-side rendering (CSR) atau server-side rendering (SSR) sesuai kebutuhan halaman

### CSS/Styling
- Gunakan TailwindCSS untuk styling
- Hindari styling inline kecuali untuk nilai dinamis
- Ikuti pola desain yang konsisten di seluruh aplikasi

## Alur Kerja Git

- Commit sering dengan pesan yang jelas dan deskriptif
- Ikuti [Conventional Commits](https://www.conventionalcommits.org/) untuk pesan commit
- Rebase branch Anda sebelum membuat PR

## Lingkungan Pengembangan

Untuk mengatur lingkungan pengembangan lokal:

1. Setelah clone, instal dependencies:
   ```
   npm install
   ```

2. Buat file `.env.local` dari `.env.example`:
   ```
   cp .env.example .env.local
   ```

3. Isi `.env.local` dengan kredensial MongoDB Anda

4. Jalankan server pengembangan:
   ```
   npm run dev
   ```

## Testing

- Tulis test untuk kode baru jika memungkinkan
- Jalankan test yang ada sebelum membuat PR:
  ```
  npm test
  ```

## Laporan Bug dan Permintaan Fitur

- Gunakan GitHub Issues untuk melaporkan bug atau meminta fitur
- Gunakan template yang disediakan untuk laporan bug dan permintaan fitur

## Pedoman Pull Request

- Deskripsi PR harus menjelaskan perubahan dengan jelas
- Tambahkan screenshot jika perubahan melibatkan UI
- Link ke issue terkait jika ada
- Tunggu review dan bersabar

Sekali lagi, terima kasih atas kontribusi Anda! 