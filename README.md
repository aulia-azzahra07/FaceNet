# Civil Presence - Portal Web Admin & Pimpinan Presensi ASN

Aplikasi portal web resmi untuk Administrator Satker dan Pimpinan dalam memantau, mengelola data aparatur, dan mengevaluasi laporan rekapitulasi kehadiran biometrik wajah Aparatur Sipil Negara (ASN). Terintegrasi langsung dengan aplikasi mobile Flutter `face_recognition_app`.

---

## 🌟 Fitur Utama (Sesuai PRD)

### 1. Peran Administrator (Admin Satker)
- **Pemantauan Real-Time (`/dashboard/pemantauan`)**:
  - Kartu KPI: Total Pegawai Terdaftar, Tepat Waktu (&le; 08:00 WIB), Terlambat, Belum Presensi, dan Tertunda Offline.
  - Filter interaktif: Tanggal, Unit Kerja, Status Kehadiran, dan Pencarian Nama/NIP.
  - Tabel log kehadiran dengan status verifikasi FaceNet, uji liveness (anti-spoofing), dan sinkronisasi.
  - Modal Rincian Audit Forensik: Perbandingan timestamp perangkat vs timestamp kedatangan server, koordinat GPS, dan deteksi Mock GPS (Fake GPS).
  - Sakelar *Auto-Refresh* berkala (15 detik) atau muat ulang manual.
- **Manajemen Data Pegawai (`/dashboard/pegawai`)**:
  - Daftar pegawai aktif dengan status pengikatan perangkat (*Device Binding*) dan kelengkapan biometrik.
  - Tambah Pegawai Baru dan Edit Data Pegawai.
  - **Reset Perangkat (Device Unbinding)**: Memutuskan kaitan ID perangkat ponsel dengan dialog konfirmasi alasan resmi dan audit log, memungkinkan pegawai menautkan perangkat baru.
- **Laporan Rekapitulasi (`/dashboard/laporan`)**:
  - Filter periode Bulan, Tahun, dan Satuan Kerja.
  - Perhitungan otomatis: Hadir Tepat Waktu, Terlambat, Total Menit Keterlambatan, Alpa, dan Persentase Kehadiran (Standar KemenPAN-RB / BKN).
  - **Ekspor Dokumen Resmi**:
    - **Unduh PDF**: Format kop resmi instansi pemerintah, ringkasan eksekutif, tabel bergaris, dan blok tanda tangan persetujuan pimpinan.
    - **Ekspor Excel (.xlsx)**: File spreadsheet terstruktur siap olah.

### 2. Peran Pimpinan (Kepala Lembaga / Dekan)
- Tampilan khusus dan bersih (*read-only*) untuk pemantauan eksekutif.
- Fokus langsung pada Laporan Kehadiran (`/dashboard/laporan`).
- Pengunduhan berkas laporan PDF resmi untuk disposisi dan persetujuan tunjangan kinerja (TPP).

---

## 🔑 Akun Uji Coba Default

Tersedia tombol **1-Klik Uji Coba Cepat** di halaman login:

| Peran | Username / NIP | Password | Halaman Default |
|---|---|---|---|
| **Administrator** | `ADMIN001` | `admin123` | `/dashboard/pemantauan` |
| **Pimpinan Satker** | `PIMPINAN001` | `pimpinan123` | `/dashboard/laporan` |

Data Pegawai ASN Awal (Tersinkron dengan Mobile App):
1. **198501152010121001** - Ahmad Fauzi, S.Kom. (Perangkat Terikat: `UP1A.231005.007`)
2. **199203102015032002** - Siti Rahmawati, M.T. (Perangkat Terikat: `SEC-8921-ANDROID`)
3. **199607222020121003** - Budi Santoso, S.T. (Belum Mengikat Perangkat / Siap Uji Login Pertama)

---

## 🚀 Menjalankan Aplikasi Web

### 1. Mode Pengembangan Lokal
Jalankan perintah berikut di dalam direktori `web_Admin_dan_pimpinan`:
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

### 2. Build Produksi
```bash
npm run build
npm start
```

---

## ☁️ Panduan Deploy ke Vercel (Database-less Ready)

Aplikasi dirancang **100% tanpa ketergantungan database eksternal**, menggunakan penyimpanan global in-memory yang *zero-config*:

1. Pastikan folder proyek sudah diinisialisasi git atau di-push ke GitHub / GitLab:
   ```bash
   git init
   git add .
   git commit -m "feat: civil presence web admin & pimpinan"
   ```
2. Hubungkan repositori ke [Vercel](https://vercel.com):
   - Klik **Add New Project** -> **Import Git Repository**.
   - Framework preset otomatis terdeteksi sebagai **Next.js**.
   - Tidak perlu konfigurasi environment variable tambahan (atau tambahkan `JWT_SECRET` opsional).
   - Klik **Deploy**.
3. Setelah deploy selesai, Anda akan mendapatkan URL Vercel (misal: `https://civil-presence-web.vercel.app`).

---

## 📱 Integrasi dengan Aplikasi Mobile (`face_recognition_app`)

Aplikasi Flutter telah dilengkapi klien REST API otomatis di `lib/data/remote/mock_attendance_server.dart`:

- **Android Emulator**: Mengakses server lokal via `http://10.0.2.2:3000`.
- **Produksi / Vercel**: 
  - Ganti nilai `defaultApiBaseUrl` di `lib/core/constants/app_constants.dart` dengan URL Vercel Anda, contoh:
    ```dart
    static const String defaultApiBaseUrl = 'https://civil-presence-web.vercel.app';
    ```
- **Ketahanan Luring (Offline First)**:
  - Jika server web tidak aktif atau smartphone tidak ada sinyal internet, aplikasi mobile secara otomatis menyimpan presensi ke antrean database SQLite lokal (`antrean_presensi`) dengan timestamp asli perangkat (KNF-05).
  - Ketika server kembali online, `SyncService` akan secara otomatis mengirimkan seluruh antrean presensi ke endpoint `/api/presensi` tanpa risiko duplikasi data (KNF-04).
