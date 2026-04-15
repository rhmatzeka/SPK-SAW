# SPK SAW Web App

Aplikasi web Sistem Penunjang Keputusan (SPK) menggunakan metode SAW (Simple Additive Weighting) dengan stack:

- Frontend: React + TypeScript + Vite
- UI: Tailwind CSS + komponen shadcn-style
- Backend: Laravel 11 REST API
- Database: MySQL 8
- Auth: Laravel Sanctum
- State: Zustand
- Chart: Recharts

## Fitur

- Login/logout dengan role `admin` dan `user`
- CRUD user untuk admin
- CRUD kriteria dengan validasi total bobot `= 1.0000`
- CRUD alternatif dengan upload file opsional
- Input nilai matriks keputusan
- Proses perhitungan SAW lengkap:
  - matriks keputusan
  - normalisasi benefit/cost
  - nilai preferensi
  - ranking
- Dashboard statistik dan riwayat
- Export hasil ke PDF dan Excel
- Responsive dan dark mode

## Struktur Folder

```text
SAW/
├── backend/   # Laravel 11 API
└── frontend/  # React + Vite app
```

## Kebutuhan

- PHP 8.2+
- Composer
- Node.js + npm
- MySQL / XAMPP MySQL aktif

## Database

File SQL siap import:

- [backend/database/sql/spk_saw.sql](</c:/Rahmat Folder/UNPAM/TUGAS/SPK/SAW/backend/database/sql/spk_saw.sql:1>)

Langkah import di phpMyAdmin:

1. Buat database `spk_saw` jika belum ada.
2. Buka tab `Import`.
3. Pilih file `backend/database/sql/spk_saw.sql`.
4. Jalankan import.

Login seed default:

- Admin: `admin@spk.test` / `password`
- User: `user@spk.test` / `password`

## Konfigurasi Backend

File env utama:

- [backend/.env](</c:/Rahmat Folder/UNPAM/TUGAS/SPK/SAW/backend/.env:1>)

Pastikan bagian database seperti ini:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=spk_saw
DB_USERNAME=root
DB_PASSWORD=
```

## Cara Menjalankan

Karena environment Windows/path dengan spasi bisa membuat `npm run dev` kurang stabil, project ini paling aman dijalankan dengan 2 terminal berikut.

### Terminal 1: Backend Laravel

```powershell
cd "c:\Rahmat Folder\UNPAM\TUGAS\SPK\SAW\backend"
php -S 127.0.0.1:8000 -t public server-router.php
```

### Terminal 2: Frontend React

Build dulu frontend:

```powershell
cd "c:\Rahmat Folder\UNPAM\TUGAS\SPK\SAW\frontend"
npm install
npm run build
php -S 127.0.0.1:5173 -t dist
```

Lalu buka:

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:8000`

Kalau ada perubahan kode frontend, jalankan lagi:

```powershell
npm run build
```

## Alternatif Setup Laravel

Kalau database sudah siap dan kamu ingin sinkron ke migrasi Laravel:

```powershell
cd "c:\Rahmat Folder\UNPAM\TUGAS\SPK\SAW\backend"
php artisan migrate --seed
```

Catatan:

- Bila sebelumnya import SQL manual, tabel `migrations` Laravel mungkin belum ada.
- Untuk penggunaan aplikasi biasa, import SQL saja sudah cukup.

## File Penting

- Backend API routes: [backend/routes/api.php](</c:/Rahmat Folder/UNPAM/TUGAS/SPK/SAW/backend/routes/api.php:1>)
- SAW service: [backend/app/Services/SAWService.php](</c:/Rahmat Folder/UNPAM/TUGAS/SPK/SAW/backend/app/Services/SAWService.php:1>)
- Frontend app root: [frontend/src/App.tsx](</c:/Rahmat Folder/UNPAM/TUGAS/SPK/SAW/frontend/src/App.tsx:1>)
- Dashboard page: [frontend/src/pages/DashboardPage.tsx](</c:/Rahmat Folder/UNPAM/TUGAS/SPK/SAW/frontend/src/pages/DashboardPage.tsx:1>)
- Hasil SAW page: [frontend/src/pages/PerhitunganPage.tsx](</c:/Rahmat Folder/UNPAM/TUGAS/SPK/SAW/frontend/src/pages/PerhitunganPage.tsx:1>)

## Troubleshooting

### 1. Login muncul `Network Error`

Biasanya karena:

- backend belum jalan
- frontend mengarah ke origin berbeda
- CORS belum sesuai

Project ini sudah diset agar cocok untuk:

- `http://127.0.0.1:5173`
- `http://localhost:5173`

Kalau masih error:

1. pastikan backend jalan di `127.0.0.1:8000`
2. pastikan frontend dibuka dari `127.0.0.1:5173`
3. restart backend setelah ubah `.env`

### 2. MySQL XAMPP hidup tapi Laravel belum konek

Cek:

- service MySQL benar-benar aktif
- database `spk_saw` sudah ada
- user/password di `.env` sesuai

### 3. Frontend tidak auto reload

Frontend dijalankan dari hasil build statis, jadi setelah edit file React kamu perlu:

```powershell
cd "c:\Rahmat Folder\UNPAM\TUGAS\SPK\SAW\frontend"
npm run build
```

## Catatan

README ini dibuat mengikuti kondisi project saat ini, termasuk cara run yang paling stabil di environment lokalmu.
