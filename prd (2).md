# PRD — Presensi FR (Aplikasi Web Admin & Pimpinan)

| Item | Keterangan |
|---|---|
| Nama Produk | Presensi Face Recognition (Presensi FR) — Web |
| Platform | Web (responsive desktop-first) |
| Pengguna | Admin, Pimpinan |
| Versi Dokumen | 1.0 (Draft) |
| Referensi | Gambar 4.15 – 4.19 (rancangan antarmuka) |

---

## 1. Ringkasan

Presensi FR adalah sistem presensi pegawai berbasis pengenalan wajah. Presensi dilakukan pegawai melalui aplikasi mobile; **aplikasi web ini** dipakai oleh **Admin** dan **Pimpinan** untuk memantau kehadiran, mengelola data pegawai, dan menyusun laporan rekapitulasi.

Dokumen ini hanya mencakup **modul web**. Proses perekaman wajah dan presensi di perangkat pegawai berada di luar cakupan dan diperlakukan sebagai sumber data.

## 2. Tujuan

1. Memberikan Admin pemantauan presensi harian secara hampir real-time.
2. Memusatkan pengelolaan data pegawai, hak akses, area kerja, dan pengikatan perangkat.
3. Menghasilkan laporan rekapitulasi kehadiran yang dapat diekspor (PDF/Excel).
4. Memberikan Pimpinan akses baca-saja ke rekap kehadiran dengan unduhan PDF.

### Indikator Keberhasilan (usulan)
- Admin dapat menyelesaikan penambahan pegawai < 2 menit.
- Laporan rekap satu periode tampil < 3 detik untuk ≤ 1.000 pegawai.
- 100% halaman terlindungi hak akses (tidak ada akses lintas peran).

## 3. Peran & Hak Akses

| Fitur | Admin | Pimpinan |
|---|:---:|:---:|
| Login | ✅ | ✅ |
| Pemantauan Presensi | ✅ | ❌ |
| Kelola Data Pegawai | ✅ | ❌ |
| Laporan Rekapitulasi (lihat) | ✅ | ✅ (Laporan Presensi) |
| Ekspor PDF | ✅ | ✅ |
| Ekspor Excel | ✅ | ❌ |
| Reset Perangkat | ✅ | ❌ |

Hak akses ditentukan oleh akun (field *Hak Akses*) dan menentukan halaman tujuan setelah login.

## 4. Ruang Lingkup

### Dalam cakupan
- Login Admin & Pimpinan
- Dashboard pemantauan presensi (Admin)
- Kelola data pegawai (CRUD, hak akses, area kerja, reset perangkat)
- Laporan rekapitulasi (Admin) dan laporan presensi (Pimpinan)
- Ekspor PDF & Excel

### Di luar cakupan
- Presensi dan pendaftaran wajah pada aplikasi mobile
- Pengelolaan cuti/izin/lembur
- Penggajian
- Manajemen area kerja (master data area dianggap sudah tersedia)

## 5. Navigasi & Layout

- **Layout:** sidebar kiri + area konten utama.
- **Sidebar Admin:** Pemantauan Presensi · Data Pegawai · Laporan Rekapitulasi · (footer) Nama pengguna & peran · Keluar.
- **Sidebar Pimpinan:** Laporan Presensi · (footer) Nama pengguna & peran · Keluar.
- Menu aktif diberi penanda (kotak/highlight).

## 6. Kebutuhan Fungsional

### 6.1 Halaman Login (Gambar 4.15)

**Deskripsi:** Akses awal untuk Admin dan Pimpinan.

| ID | Kebutuhan |
|---|---|
| FR-LOG-01 | Form berisi input **NIP/Username**, **Password** (masked), dan tombol **Masuk**. |
| FR-LOG-02 | Sistem memvalidasi kredensial; jika valid, arahkan sesuai hak akses (Admin → Pemantauan Presensi, Pimpinan → Laporan Presensi). |
| FR-LOG-03 | Jika tidak valid, tampilkan pesan error generik (tanpa menyebut field mana yang salah). |
| FR-LOG-04 | Akun dengan hak akses selain Admin/Pimpinan tidak dapat login ke web. |
| FR-LOG-05 | Validasi field wajib; tombol Masuk menampilkan status loading saat proses. |
| FR-LOG-06 | Sesi kedaluwarsa otomatis setelah periode tidak aktif (usulan: 30 menit) dan menu **Keluar** mengakhiri sesi. |

**Kriteria penerimaan:** Pengguna valid masuk ke halaman yang sesuai peran; pengguna tidak valid tetap di halaman login dengan pesan kesalahan.

---

### 6.2 Pemantauan Data Presensi — Admin (Gambar 4.16)

**Deskripsi:** Memantau catatan kehadiran seluruh pegawai.

| ID | Kebutuhan |
|---|---|
| FR-MON-01 | Filter **Tanggal** (default: hari ini) dan filter **Area Kerja** (default: semua). |
| FR-MON-02 | Kartu ringkasan: **Total Pegawai**, **Hadir**, **Terlambat**, **Belum Presensi**, mengikuti filter aktif. |
| FR-MON-03 | Tabel presensi dengan kolom: **NIP, Nama, Jam Masuk, Jam Pulang, Status, Sinkronisasi**. |
| FR-MON-04 | Kolom **Status** (usulan nilai): Hadir, Terlambat, Belum Presensi. |
| FR-MON-05 | Kolom **Sinkronisasi** menunjukkan apakah data dari perangkat sudah masuk ke server (mis. Tersinkron / Menunggu). |
| FR-MON-06 | Tabel memiliki paginasi (`‹ 1 2 3 ›`). |
| FR-MON-07 | Data dapat dimuat ulang tanpa berpindah halaman (refresh manual; auto-refresh opsional). |
| FR-MON-08 | Kondisi kosong: tampilkan pesan "Tidak ada data presensi". |

**Kriteria penerimaan:** Perubahan filter memperbarui kartu ringkasan dan tabel secara konsisten.

---

### 6.3 Kelola Data Pegawai — Admin (Gambar 4.17)

**Deskripsi:** Mengelola informasi pegawai, hak akses, area kerja, dan perangkat terikat.

| ID | Kebutuhan |
|---|---|
| FR-EMP-01 | Pencarian berdasarkan **NIP atau nama**. |
| FR-EMP-02 | Filter **Hak Akses** pada daftar. |
| FR-EMP-03 | Tabel pegawai: **NIP, Nama, Hak Akses, Area Kerja, Aksi** (`Ubah`, `Hapus`). |
| FR-EMP-04 | Tombol **+ Tambah Pegawai** mengosongkan form untuk input baru. |
| FR-EMP-05 | Form: **NIP, Nama Lengkap, Password Awal, Hak Akses, Area Kerja**, tombol **Simpan** dan **Reset Perangkat**. |
| FR-EMP-06 | Aksi **Ubah** memuat data pegawai ke form; field Password Awal tidak ditampilkan ulang (opsional diisi untuk mengganti). |
| FR-EMP-07 | **NIP unik**; simpan ditolak jika duplikat. |
| FR-EMP-08 | Password disimpan ter-hash (tidak pernah plaintext). |
| FR-EMP-09 | **Hapus** meminta konfirmasi; sebaiknya *soft delete* agar riwayat presensi tetap utuh. |
| FR-EMP-10 | **Reset Perangkat** melepas ikatan perangkat pegawai sehingga pegawai dapat mendaftarkan perangkat baru; wajib konfirmasi dan dicatat di log aktivitas. |
| FR-EMP-11 | Hak Akses (usulan): Pegawai, Admin, Pimpinan. |
| FR-EMP-12 | Paginasi pada daftar pegawai. |

**Kriteria penerimaan:** Pegawai baru muncul di daftar setelah disimpan; perubahan hak akses berlaku pada login berikutnya.

---

### 6.4 Laporan Rekapitulasi Presensi — Admin (Gambar 4.18)

| ID | Kebutuhan |
|---|---|
| FR-REP-01 | Filter **Periode** dan **Area Kerja**, dengan tombol **Tampilkan** untuk menerapkan filter. |
| FR-REP-02 | Kartu ringkasan: **Rata-rata Kehadiran**, **Total Terlambat**, **Total Tidak Hadir**. |
| FR-REP-03 | Tabel rekap per pegawai: **NIP, Nama, Hadir, Terlambat, Tidak Hadir, % Kehadiran**. |
| FR-REP-04 | Tombol **Ekspor PDF** dan **Ekspor Excel** mengekspor data sesuai filter yang sedang ditampilkan. |
| FR-REP-05 | Paginasi tabel; ekspor tetap mencakup seluruh data hasil filter (bukan hanya halaman aktif). |
| FR-REP-06 | Kondisi kosong dan error ditampilkan dengan pesan yang jelas. |

**Rumus (usulan, perlu konfirmasi):**
`% Kehadiran = (Hadir + Terlambat) / Total Hari Kerja × 100`

---

### 6.5 Laporan Presensi — Pimpinan (Gambar 4.19)

| ID | Kebutuhan |
|---|---|
| FR-PIM-01 | Halaman baca-saja dengan filter **Periode** dan **Area Kerja**, tombol **Tampilkan**. |
| FR-PIM-02 | Kartu ringkasan: Rata-rata Kehadiran, Total Terlambat, Total Tidak Hadir. |
| FR-PIM-03 | Tabel presensi pegawai dengan kolom yang sama seperti laporan Admin. |
| FR-PIM-04 | Hanya tombol **Unduh PDF** (tanpa Excel). |
| FR-PIM-05 | Pimpinan tidak dapat mengakses halaman/endpoint Admin (dicek di sisi server). |

## 7. Alur Pengguna Utama

1. **Admin:** Login → Pemantauan Presensi → (cek pegawai belum presensi) → Data Pegawai → tambah/ubah pegawai → Laporan Rekapitulasi → Ekspor.
2. **Pimpinan:** Login → Laporan Presensi → pilih periode & area → Tampilkan → Unduh PDF.
3. **Ganti perangkat pegawai:** Admin → Data Pegawai → Ubah pegawai → Reset Perangkat → konfirmasi.

## 8. Model Data (Usulan)

**Pegawai/Pengguna:** `id`, `nip` (unik), `nama`, `password_hash`, `hak_akses`, `area_kerja_id`, `device_id` (nullable), `aktif`, `created_at`, `updated_at`

**Presensi:** `id`, `pegawai_id`, `tanggal`, `jam_masuk`, `jam_pulang`, `status`, `status_sinkronisasi`, `area_kerja_id`

**Area Kerja:** `id`, `nama`

**Log Aktivitas:** `id`, `user_id`, `aksi`, `target`, `waktu`

## 9. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| Keamanan | HTTPS, hash password (bcrypt/argon2), proteksi CSRF/XSS/SQL injection, otorisasi berbasis peran di server, pembatasan percobaan login. |
| Kinerja | Halaman utama dimuat < 3 detik; tabel menggunakan paginasi sisi server. |
| Ketersediaan | Target uptime ≥ 99% pada jam kerja. |
| Kompatibilitas | Browser modern (Chrome, Edge, Firefox, Safari versi terbaru); layar ≥ 1024 px prioritas. |
| Privasi | Data biometrik tidak ditampilkan di web; akses data pegawai sesuai peran. |
| Audit | Aksi sensitif (tambah/ubah/hapus pegawai, reset perangkat, ekspor) tercatat. |
| Bahasa | Antarmuka Bahasa Indonesia. |

## 10. Kebutuhan Integrasi (Usulan Endpoint)

| Metode | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/auth/login` | Login web |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/presensi?tanggal=&area=&page=` | Data pemantauan + ringkasan |
| GET | `/api/pegawai?q=&hak_akses=&page=` | Daftar pegawai |
| POST | `/api/pegawai` | Tambah pegawai |
| PUT | `/api/pegawai/{id}` | Ubah pegawai |
| DELETE | `/api/pegawai/{id}` | Hapus pegawai |
| POST | `/api/pegawai/{id}/reset-perangkat` | Reset perangkat |
| GET | `/api/laporan/rekap?periode=&area=&page=` | Rekap presensi |
| GET | `/api/laporan/rekap/export?format=pdf\|xlsx&periode=&area=` | Ekspor laporan |

## 11. Penanganan Error & Kondisi Khusus

- Kredensial salah → pesan generik pada halaman login.
- Sesi habis → arahkan ke login dengan pesan.
- Akses tanpa izin → halaman 403 / redirect ke halaman sesuai peran.
- Gagal memuat data → pesan error dengan opsi muat ulang.
- Ekspor gagal → notifikasi tanpa kehilangan filter aktif.

## 12. Asumsi

1. Data presensi diisi oleh aplikasi mobile dan tersedia melalui API yang sama.
2. Satu pegawai terikat pada satu perangkat dan satu area kerja.
3. Akun Admin/Pimpinan memakai NIP sebagai username.
4. Master area kerja sudah tersedia.

## 13. Pertanyaan Terbuka

1. Apakah satu pegawai boleh memiliki lebih dari satu area kerja?
2. Aturan jam masuk, toleransi, dan hari kerja untuk menentukan "Terlambat" dan "Tidak Hadir"?
3. Apakah filter Periode berupa bulan, rentang tanggal bebas, atau keduanya?
4. Apakah perlu fitur lupa/ganti password mandiri?
5. Apakah pegawai yang dihapus harus tetap muncul di laporan historis?
6. Apakah Pimpinan perlu dibatasi pada area kerja tertentu?

## 14. Rencana Rilis (Usulan)

| Fase | Cakupan |
|---|---|
| MVP | Login, Kelola Data Pegawai, Pemantauan Presensi |
| Rilis 2 | Laporan Rekapitulasi + ekspor PDF/Excel, Laporan Pimpinan |
| Rilis 3 | Log aktivitas, auto-refresh, penyempurnaan UX |
