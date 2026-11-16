export type HakAkses = 'ADMIN' | 'PIMPINAN' | 'PEGAWAI';

export interface AreaKerja {
  id: string;
  nama: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  jamMasuk: string;
  batasTerlambat: string;
  jamPulang: string;
}

export interface Pegawai {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  unitKerja: string;
  lokasiId: string;
  areaKerjaId?: string;
  passwordHash?: string;
  hakAkses: HakAkses;
  deviceId?: string | null;
  faceEmbedding?: number[] | null;
  pinHash?: string | null;
  email?: string;
  nomorTelepon?: string;
  registeredAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StatusPresensi =
  | 'HADIR_TEPAT_WAKTU'
  | 'HADIR_TERLAMBAT'
  | 'BELUM_PRESENSI'
  | 'hadir'
  | 'terlambat'
  | 'belum_presensi';

export type StatusSinkronisasi = 'TERKIRIM' | 'MENUNGGU_SINKRONISASI' | 'tersinkron' | 'menunggu';

export type MetodePresensi = 'FACE_RECOGNITION' | 'PIN' | 'wajah' | 'pin';

export interface PresensiRecord {
  id: string;
  pegawaiId?: string;
  nip: string;
  nama: string;
  unitKerja?: string;
  tanggal?: string; // YYYY-MM-DD
  jamMasuk?: string | null;
  jamPulang?: string | null;
  timestamp?: string; // ISO
  type?: 'MASUK' | 'PULANG';
  status: StatusPresensi;
  statusSinkronisasi?: StatusSinkronisasi;
  syncStatus?: 'TERKIRIM' | 'MENUNGGU_SINKRONISASI';
  method?: MetodePresensi;
  metode?: MetodePresensi;
  confidenceScore?: number;
  isLivenessVerified?: boolean;
  isMockLocation?: boolean;
  isLocationValid?: boolean;
  isOfflineRecord?: boolean;
  serverReceivedTime?: string;
  deviceId?: string;
  areaKerjaId?: string;
  lokasiId?: string;
  latitude?: number;
  longitude?: number;
  jarakMeter?: number;
  createdAt?: string;
}

export interface RingkasanPresensi {
  totalPegawai: number;
  tepatWaktu: number;
  terlambat: number;
  belumPresensi: number;
  offlinePending: number;
}

export interface RekapPegawai {
  pegawaiId: string;
  id?: string;
  nip: string;
  nama: string;
  jabatan: string;
  unitKerja: string;
  totalHariKerja: number;
  hadirTepatWaktu: number;
  hadirTerlambat: number;
  totalMenitKeterlambatan: number;
  tidakHadir: number;
  persentaseKehadiran: number;
}

export interface RingkasanRekap {
  rataRataKehadiran: number;
  totalTerlambat: number;
  totalAbsen: number;
  totalPegawai: number;
}

export interface LogAktivitas {
  id: string;
  userId: string;
  namaUser: string;
  aksi: string;
  target: string;
  waktu: string;
}
