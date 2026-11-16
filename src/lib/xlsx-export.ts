import * as XLSX from 'xlsx';
import { RekapPegawai } from '@/types';

export function exportRekapToExcel(
  data: RekapPegawai[],
  meta: { bulan: number; tahun: number; unitKerja: string }
) {
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ][meta.bulan - 1] || 'Bulan';

  const rows = data.map((item, index) => ({
    'No': index + 1,
    'NIP': item.nip,
    'Nama Pegawai': item.nama,
    'Jabatan': item.jabatan,
    'Unit Kerja': item.unitKerja,
    'Total Hari Kerja': item.totalHariKerja,
    'Hadir Tepat Waktu (Hari)': item.hadirTepatWaktu,
    'Hadir Terlambat (Hari)': item.hadirTerlambat,
    'Total Keterlambatan (Menit)': item.totalMenitKeterlambatan,
    'Tidak Hadir / Alpa (Hari)': item.tidakHadir,
    'Persentase Kehadiran (%)': item.persentaseKehadiran,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekapitulasi Presensi');

  XLSX.writeFile(workbook, `Rekap_Presensi_Perusahaan_XYZ_${namaBulan}_${meta.tahun}.xlsx`);
}
