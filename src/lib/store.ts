import {
  Pegawai,
  AreaKerja,
  PresensiRecord,
  RekapPegawai,
  RingkasanPresensi,
  RingkasanRekap,
  LogAktivitas,
  HakAkses,
} from '@/types';
import bcrypt from 'bcryptjs';

// Pre-seeded locations: Lingkungan Kantor Perusahaan XYZ
const DEFAULT_LOCATIONS: AreaKerja[] = [
  {
    id: 'LOK-001',
    nama: 'Kantor Pusat PT XYZ',
    latitude: -2.984900,
    longitude: 104.732238,
    radiusMeters: 150.0,
    jamMasuk: '08:00',
    batasTerlambat: '08:15',
    jamPulang: '17:00',
  },
  {
    id: 'LOK-002',
    nama: 'Kantor Cabang A',
    latitude: -3.218500,
    longitude: 104.649600,
    radiusMeters: 250.0,
    jamMasuk: '08:00',
    batasTerlambat: '08:15',
    jamPulang: '17:00',
  },
];

const HASH_ADMIN = bcrypt.hashSync('admin123', 8);
const HASH_PIMPINAN = bcrypt.hashSync('pimpinan123', 8);
const HASH_DEFAULT = bcrypt.hashSync('123456', 8);

const DEFAULT_EMPLOYEES: Pegawai[] = [
  {
    id: 'EMP-ADM-001',
    nip: 'ADMIN001',
    nama: 'Administrator HRD',
    jabatan: 'Admin HR & Sistem',
    unitKerja: 'Kantor Pusat PT XYZ',
    lokasiId: 'LOK-001',
    passwordHash: HASH_ADMIN,
    hakAkses: 'ADMIN',
    deviceId: null,
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'EMP-PIM-001',
    nip: 'PIMPINAN001',
    nama: 'Hendra Wijaya, M.M.',
    jabatan: 'Direktur / Pimpinan Perusahaan XYZ',
    unitKerja: 'Kantor Pusat PT XYZ',
    lokasiId: 'LOK-001',
    passwordHash: HASH_PIMPINAN,
    hakAkses: 'PIMPINAN',
    deviceId: null,
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'EMP-001',
    nip: '198501152010121001',
    nama: 'Ahmad Fauzi, S.Kom.',
    jabatan: 'Staff IT & Sistem',
    unitKerja: 'Divisi Operasional & IT',
    lokasiId: 'LOK-001',
    passwordHash: HASH_DEFAULT,
    hakAkses: 'PEGAWAI',
    deviceId: 'UP1A.231005.007',
    pinHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    email: 'ahmad.fauzi@perusahaanxyz.co.id',
    nomorTelepon: '08127891234',
    isActive: true,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-11-16T08:00:00Z',
  },
  {
    id: 'EMP-002',
    nip: '199203102015032002',
    nama: 'Siti Rahmawati, S.E.',
    jabatan: 'Supervisor Operasional',
    unitKerja: 'Kantor Pusat PT XYZ',
    lokasiId: 'LOK-001',
    passwordHash: HASH_DEFAULT,
    hakAkses: 'PEGAWAI',
    deviceId: 'SEC-8921-ANDROID',
    pinHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    email: 'siti.rahmawati@perusahaanxyz.co.id',
    nomorTelepon: '081399887766',
    isActive: true,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-11-16T08:00:00Z',
  },
  {
    id: 'EMP-003',
    nip: '199607222020121003',
    nama: 'Budi Santoso, S.T.',
    jabatan: 'Staff Operasional Kantor',
    unitKerja: 'Kantor Cabang A',
    lokasiId: 'LOK-002',
    passwordHash: HASH_DEFAULT,
    hakAkses: 'PEGAWAI',
    deviceId: null,
    pinHash: null,
    email: 'budi.santoso@perusahaanxyz.co.id',
    nomorTelepon: '085211223344',
    isActive: true,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-11-16T08:00:00Z',
  },
  {
    id: 'EMP-004',
    nip: '198811042014022004',
    nama: 'Dewi Lestari, S.Ak.',
    jabatan: 'Staff Keuangan & SDM',
    unitKerja: 'Divisi Keuangan & SDM',
    lokasiId: 'LOK-001',
    passwordHash: HASH_DEFAULT,
    hakAkses: 'PEGAWAI',
    deviceId: 'DEV-DW-9912',
    pinHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    email: 'dewi.lestari@perusahaanxyz.co.id',
    nomorTelepon: '081177665544',
    isActive: true,
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-11-16T08:00:00Z',
  },
];

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const todayStr = getTodayString();

const DEFAULT_ATTENDANCES: PresensiRecord[] = [
  {
    id: 'ATT-20261116-001',
    pegawaiId: 'EMP-001',
    nip: '198501152010121001',
    nama: 'Ahmad Fauzi, S.Kom.',
    unitKerja: 'Divisi Operasional & IT',
    tanggal: todayStr,
    timestamp: `${todayStr}T07:54:12Z`,
    jamMasuk: '07:54:12',
    jamPulang: '17:05:44',
    type: 'MASUK',
    status: 'HADIR_TEPAT_WAKTU',
    statusSinkronisasi: 'TERKIRIM',
    syncStatus: 'TERKIRIM',
    method: 'FACE_RECOGNITION',
    metode: 'wajah',
    confidenceScore: 0.94,
    isLivenessVerified: true,
    isMockLocation: false,
    isLocationValid: true,
    isOfflineRecord: false,
    serverReceivedTime: `${todayStr}T07:54:15Z`,
    deviceId: 'UP1A.231005.007',
    lokasiId: 'LOK-001',
    jarakMeter: 18.2,
    latitude: -2.984890,
    longitude: 104.732240,
    createdAt: `${todayStr}T07:54:12Z`,
  },
  {
    id: 'ATT-20261116-002',
    pegawaiId: 'EMP-002',
    nip: '199203102015032002',
    nama: 'Siti Rahmawati, S.E.',
    unitKerja: 'Kantor Pusat PT XYZ',
    tanggal: todayStr,
    timestamp: `${todayStr}T08:22:04Z`,
    jamMasuk: '08:22:04',
    jamPulang: null,
    type: 'MASUK',
    status: 'HADIR_TERLAMBAT',
    statusSinkronisasi: 'TERKIRIM',
    syncStatus: 'TERKIRIM',
    method: 'FACE_RECOGNITION',
    metode: 'wajah',
    confidenceScore: 0.91,
    isLivenessVerified: true,
    isMockLocation: false,
    isLocationValid: true,
    isOfflineRecord: false,
    serverReceivedTime: `${todayStr}T08:22:06Z`,
    deviceId: 'SEC-8921-ANDROID',
    lokasiId: 'LOK-001',
    jarakMeter: 34.5,
    latitude: -2.984920,
    longitude: 104.732250,
    createdAt: `${todayStr}T08:22:04Z`,
  },
];

const DEFAULT_LOGS: LogAktivitas[] = [
  {
    id: 'LOG-001',
    userId: 'EMP-ADM-001',
    namaUser: 'Administrator HRD',
    aksi: 'INISIALISASI_SISTEM',
    target: 'Sistem Presensi Perusahaan XYZ Aktif',
    waktu: '16/11/2026, 07:00:00',
  },
];

class InMemoryDataStore {
  private locations: AreaKerja[] = [...DEFAULT_LOCATIONS];
  private employees: Pegawai[] = [...DEFAULT_EMPLOYEES];
  private attendances: PresensiRecord[] = [...DEFAULT_ATTENDANCES];
  private logs: LogAktivitas[] = [...DEFAULT_LOGS];

  // --- AUTHENTICATION ---
  authenticate(username: string, password: string): { user: { id: string; nip: string; nama: string; role: HakAkses; unitKerja: string } } | null {
    const q = username.trim().toLowerCase();
    const emp = this.employees.find(
      (e) => (e.nip.toLowerCase() === q || e.id.toLowerCase() === q) && e.isActive
    );

    if (!emp) return null;

    if (emp.passwordHash && bcrypt.compareSync(password, emp.passwordHash)) {
      this.addLog(emp.id, emp.nama, 'LOGIN_BERHASIL', `Role ${emp.hakAkses}`);
      return {
        user: {
          id: emp.id,
          nip: emp.nip,
          nama: emp.nama,
          role: emp.hakAkses,
          unitKerja: emp.unitKerja,
        },
      };
    }

    return null;
  }

  // --- MASTER LOKASI ---
  getLocations(): AreaKerja[] {
    return this.locations;
  }

  getLocationById(id: string): AreaKerja | undefined {
    return this.locations.find((l) => l.id === id);
  }

  // --- DATA PEGAWAI ---
  getEmployees(options?: { search?: string; unitKerja?: string; statusPerangkat?: string; hakAkses?: string }): Pegawai[] {
    let list = this.employees.filter((e) => e.isActive);

    if (options?.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (e) => e.nip.toLowerCase().includes(q) || e.nama.toLowerCase().includes(q) || e.jabatan.toLowerCase().includes(q)
      );
    }

    if (options?.unitKerja && options.unitKerja !== 'SEMUA') {
      list = list.filter((e) => e.unitKerja === options.unitKerja || e.lokasiId === options.unitKerja);
    }

    if (options?.hakAkses && options.hakAkses !== 'SEMUA') {
      list = list.filter((e) => e.hakAkses === options.hakAkses);
    }

    if (options?.statusPerangkat === 'TERIKAT') {
      list = list.filter((e) => Boolean(e.deviceId));
    } else if (options?.statusPerangkat === 'BELUM_TERIKAT') {
      list = list.filter((e) => !e.deviceId);
    }

    return list;
  }

  getEmployeeById(id: string): Pegawai | undefined {
    return this.employees.find((e) => e.id === id && e.isActive);
  }

  getEmployeeByNip(nip: string): Pegawai | undefined {
    return this.employees.find((e) => e.nip.trim() === nip.trim() && e.isActive);
  }

  createEmployee(data: Partial<Pegawai> & { password?: string }, adminName: string = 'Administrator'): Pegawai {
    if (!data.nip || !data.nama) {
      throw new Error('NIP dan Nama Pegawai wajib diisi');
    }

    if (this.employees.some((e) => e.nip.trim() === data.nip?.trim() && e.isActive)) {
      throw new Error(`Pegawai dengan NIP ${data.nip} sudah terdaftar!`);
    }

    const rawPass = data.password && data.password.trim() !== '' ? data.password.trim() : '123456';

    const newEmp: Pegawai = {
      id: `EMP-${Date.now()}`,
      nip: data.nip.trim(),
      nama: data.nama.trim(),
      jabatan: data.jabatan?.trim() || 'Pegawai',
      unitKerja: data.unitKerja || 'Kantor Pusat PT XYZ',
      lokasiId: data.lokasiId || 'LOK-001',
      passwordHash: bcrypt.hashSync(rawPass, 8),
      hakAkses: (data.hakAkses as HakAkses) || 'PEGAWAI',
      deviceId: null,
      faceEmbedding: null,
      pinHash: null,
      email: data.email || '',
      nomorTelepon: data.nomorTelepon || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.employees.unshift(newEmp);
    this.addLog('EMP-ADM-001', adminName, 'TAMBAH_PEGAWAI', `NIP ${newEmp.nip} (${newEmp.nama})`);
    return newEmp;
  }

  updateEmployee(id: string, data: Partial<Pegawai> & { password?: string }, adminName: string = 'Administrator'): Pegawai {
    const idx = this.employees.findIndex((e) => e.id === id && e.isActive);
    if (idx === -1) {
      throw new Error('Pegawai tidak ditemukan.');
    }

    const current = this.employees[idx];
    if (data.nip && data.nip.trim() !== current.nip) {
      if (this.employees.some((e) => e.id !== id && e.nip.trim() === data.nip?.trim() && e.isActive)) {
        throw new Error(`NIP ${data.nip} sudah digunakan pegawai lain.`);
      }
    }

    const updated: Pegawai = {
      ...current,
      nip: data.nip ? data.nip.trim() : current.nip,
      nama: data.nama ? data.nama.trim() : current.nama,
      jabatan: data.jabatan ? data.jabatan.trim() : current.jabatan,
      unitKerja: data.unitKerja || current.unitKerja,
      lokasiId: data.lokasiId || current.lokasiId,
      hakAkses: (data.hakAkses as HakAkses) || current.hakAkses,
      passwordHash: data.password && data.password.trim() !== '' ? bcrypt.hashSync(data.password.trim(), 8) : current.passwordHash,
      email: data.email !== undefined ? data.email : current.email,
      nomorTelepon: data.nomorTelepon !== undefined ? data.nomorTelepon : current.nomorTelepon,
      updatedAt: new Date().toISOString(),
    };

    this.employees[idx] = updated;
    this.addLog('EMP-ADM-001', adminName, 'UBAH_PEGAWAI', `NIP ${updated.nip} (${updated.nama})`);
    return updated;
  }

  deleteEmployee(id: string, adminName: string = 'Administrator'): boolean {
    const idx = this.employees.findIndex((e) => e.id === id);
    if (idx === -1) return false;

    this.employees[idx] = {
      ...this.employees[idx],
      isActive: false,
      updatedAt: new Date().toISOString(),
    };

    this.addLog('EMP-ADM-001', adminName, 'HAPUS_PEGAWAI', `NIP ${this.employees[idx].nip}`);
    return true;
  }

  resetPerangkat(id: string, reason: string, adminName: string = 'Administrator'): Pegawai {
    const idx = this.employees.findIndex((e) => e.id === id && e.isActive);
    if (idx === -1) {
      throw new Error('Pegawai tidak ditemukan.');
    }

    const oldDeviceId = this.employees[idx].deviceId;
    this.employees[idx] = {
      ...this.employees[idx],
      deviceId: null,
      updatedAt: new Date().toISOString(),
    };

    this.addLog(
      'EMP-ADM-001',
      adminName,
      'RESET_PERANGKAT',
      `NIP ${this.employees[idx].nip} (${reason}, ID Lama: ${oldDeviceId || 'none'})`
    );

    return this.employees[idx];
  }

  registerCredentials(data: { nip: string; faceEmbedding?: number[]; pinHash?: string; deviceId: string }): Pegawai {
    const idx = this.employees.findIndex((e) => e.nip.trim() === data.nip.trim() && e.isActive);
    if (idx === -1) {
      throw new Error(`Pegawai dengan NIP ${data.nip} tidak ditemukan di server.`);
    }

    const emp = this.employees[idx];
    if (emp.deviceId && emp.deviceId !== data.deviceId) {
      throw new Error(`Akun telah terikat pada perangkat lain (ID: ${emp.deviceId}). Harap hubungi Admin untuk reset.`);
    }

    const updated: Pegawai = {
      ...emp,
      deviceId: data.deviceId,
      faceEmbedding: data.faceEmbedding || emp.faceEmbedding,
      pinHash: data.pinHash || emp.pinHash,
      registeredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.employees[idx] = updated;
    this.addLog(emp.id, emp.nama, 'REGISTRASI_KREDENSIAL', `Device ${data.deviceId}`);
    return updated;
  }

  // --- PRESENSI RECORDING & PEMANTAUAN ---
  getAttendances(options?: {
    tanggal?: string;
    unitKerja?: string;
    status?: string;
    syncStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const targetDate = options?.tanggal || todayStr;
    const activeStaff = this.employees.filter((e) => e.isActive && e.hakAkses === 'PEGAWAI');

    // Build complete rows
    const dayAttendances = this.attendances.filter(
      (a) => (a.tanggal === targetDate) || (a.timestamp && a.timestamp.startsWith(targetDate))
    );

    const combined: PresensiRecord[] = activeStaff.map((emp) => {
      const match = dayAttendances.find((a) => a.nip === emp.nip);
      if (match) {
        return {
          ...match,
          unitKerja: emp.unitKerja,
        };
      }
      return {
        id: `BELUM-${emp.nip}-${targetDate}`,
        pegawaiId: emp.id,
        nip: emp.nip,
        nama: emp.nama,
        unitKerja: emp.unitKerja,
        tanggal: targetDate,
        timestamp: undefined,
        jamMasuk: null,
        jamPulang: null,
        type: 'MASUK',
        status: 'BELUM_PRESENSI',
        statusSinkronisasi: 'MENUNGGU_SINKRONISASI',
        syncStatus: 'MENUNGGU_SINKRONISASI',
        method: 'FACE_RECOGNITION',
        isLivenessVerified: false,
        isLocationValid: false,
      };
    });

    let filtered = combined;

    if (options?.unitKerja && options.unitKerja !== 'SEMUA') {
      filtered = filtered.filter((r) => r.unitKerja === options.unitKerja);
    }

    if (options?.status && options.status !== 'SEMUA') {
      filtered = filtered.filter((r) => r.status === options.status);
    }

    if (options?.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      filtered = filtered.filter(
        (r) => r.nip.toLowerCase().includes(q) || r.nama.toLowerCase().includes(q)
      );
    }

    const summary: RingkasanPresensi = {
      totalPegawai: filtered.length,
      tepatWaktu: filtered.filter((r) => r.status === 'HADIR_TEPAT_WAKTU').length,
      terlambat: filtered.filter((r) => r.status === 'HADIR_TERLAMBAT').length,
      belumPresensi: filtered.filter((r) => r.status === 'BELUM_PRESENSI').length,
      offlinePending: this.attendances.filter((r) => r.isOfflineRecord && r.syncStatus !== 'TERKIRIM').length,
    };

    const page = options?.page || 1;
    const limit = options?.limit || 25;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      records: paginated,
      summary,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit) || 1,
    };
  }

  submitAttendance(record: PresensiRecord): PresensiRecord {
    // Deduplication check
    const existingIndex = this.attendances.findIndex((a) => a.id === record.id);
    if (existingIndex !== -1) {
      return this.attendances[existingIndex];
    }

    // Verify employee
    const emp = this.getEmployeeByNip(record.nip);
    if (!emp) {
      throw new Error(`Pegawai NIP ${record.nip} tidak ditemukan di server.`);
    }

    if (emp.deviceId && record.deviceId && emp.deviceId !== record.deviceId) {
      throw new Error('Ditolak: Perangkat tidak sesuai dengan yang terikat pada akun!');
    }

    // Determine status: Tepat Waktu or Terlambat
    let determinedStatus: any = record.status || 'HADIR_TEPAT_WAKTU';
    if (record.timestamp) {
      try {
        const timePart = new Date(record.timestamp).toLocaleTimeString('id-ID', { hour12: false });
        if (timePart > '08:00:00') {
          determinedStatus = 'HADIR_TERLAMBAT';
        }
      } catch {}
    }

    const saved: PresensiRecord = {
      ...record,
      unitKerja: emp.unitKerja,
      status: determinedStatus,
      syncStatus: 'TERKIRIM',
      statusSinkronisasi: 'TERKIRIM',
      serverReceivedTime: new Date().toISOString(),
      tanggal: record.tanggal || todayStr,
      createdAt: new Date().toISOString(),
    };

    this.attendances.unshift(saved);
    this.addLog(emp.id, emp.nama, 'PRESENSI_BERHASIL', `${record.type} via ${record.method}`);
    return saved;
  }

  // --- LAPORAN REKAPITULASI ---
  getRekapitulasi(options?: { bulan?: number; tahun?: number; unitKerja?: string }) {
    const targetMonth = options?.bulan || (new Date().getMonth() + 1);
    const targetYear = options?.tahun || new Date().getFullYear();
    const prefix = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;

    let staff = this.employees.filter((e) => e.isActive && e.hakAkses === 'PEGAWAI');
    if (options?.unitKerja && options.unitKerja !== 'SEMUA') {
      staff = staff.filter((e) => e.unitKerja === options.unitKerja);
    }

    const monthRecords = this.attendances.filter(
      (a) => (a.tanggal && a.tanggal.startsWith(prefix)) || (a.timestamp && a.timestamp.startsWith(prefix))
    );

    const totalHariKerja = 22; // Asumsi hari kerja standar ASN per bulan

    const rekap: RekapPegawai[] = staff.map((emp) => {
      const empRecords = monthRecords.filter((a) => a.nip === emp.nip);
      const tepatWaktu = empRecords.filter((a) => a.status === 'HADIR_TEPAT_WAKTU').length;
      const terlambat = empRecords.filter((a) => a.status === 'HADIR_TERLAMBAT').length;
      const totalMasuk = tepatWaktu + terlambat;
      const alpa = Math.max(0, totalHariKerja - totalMasuk);
      const persentase = totalHariKerja > 0 ? Math.min(100, Math.round((totalMasuk / totalHariKerja) * 100)) : 0;
      const menitTelat = terlambat * 18; // Estimasi rata-rata menit keterlambatan

      return {
        pegawaiId: emp.id,
        id: emp.id,
        nip: emp.nip,
        nama: emp.nama,
        jabatan: emp.jabatan,
        unitKerja: emp.unitKerja,
        totalHariKerja,
        hadirTepatWaktu: tepatWaktu,
        hadirTerlambat: terlambat,
        totalMenitKeterlambatan: menitTelat,
        tidakHadir: alpa,
        persentaseKehadiran: persentase,
      };
    });

    const totalTerlambat = rekap.reduce((acc, curr) => acc + curr.hadirTerlambat, 0);
    const totalAbsen = rekap.reduce((acc, curr) => acc + curr.tidakHadir, 0);
    const avgPersen = rekap.length > 0 ? Math.round(rekap.reduce((acc, c) => acc + c.persentaseKehadiran, 0) / rekap.length) : 0;

    const summary: RingkasanRekap = {
      totalPegawai: rekap.length,
      rataRataKehadiran: avgPersen,
      totalTerlambat,
      totalAbsen,
    };

    return {
      rekap,
      summary,
    };
  }

  // --- LOGGING ---
  addLog(userId: string, namaUser: string, aksi: string, target: string) {
    this.logs.unshift({
      id: `LOG-${Date.now()}`,
      userId,
      namaUser,
      aksi,
      target,
      waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    });
  }

  getLogs(): LogAktivitas[] {
    return this.logs;
  }
}

// Global Singleton Instance
export const globalStore = new InMemoryDataStore();
export const store = globalStore;
