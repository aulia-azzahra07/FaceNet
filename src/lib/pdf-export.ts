import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RekapPegawai } from '@/types';

export function exportRekapToPdf(
  data: RekapPegawai[],
  summary: { totalPegawai: number; rataRataKehadiran: number; totalTerlambat: number; totalAbsen: number },
  meta: { bulan: number; tahun: number; unitKerja: string }
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ][meta.bulan - 1] || 'Bulan';

  // Kop Surat Resmi Perusahaan XYZ
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 35, 111); // Navy #00236F
  doc.text('PERUSAHAAN XYZ', 148, 16, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('LAPORAN REKAPITULASI PRESENSI PEGAWAI', 148, 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Periode: ${namaBulan} ${meta.tahun}   |   Area Kerja: ${meta.unitKerja}`, 148, 28, { align: 'center' });

  // Divider Line
  doc.setDrawColor(0, 35, 111);
  doc.setLineWidth(0.8);
  doc.line(14, 32, 283, 32);

  // Ringkasan Eksekutif
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Total Pegawai: ${summary.totalPegawai} orang  |  Rata-rata Kehadiran: ${summary.rataRataKehadiran}%  |  Total Terlambat: ${summary.totalTerlambat} kali  |  Total Alpa: ${summary.totalAbsen} kali`,
    14,
    38
  );

  // Table Body
  const tableData = data.map((item, index) => [
    (index + 1).toString(),
    item.nip,
    item.nama,
    item.jabatan,
    item.unitKerja,
    `${item.hadirTepatWaktu} hr`,
    `${item.hadirTerlambat} hr`,
    `${item.totalMenitKeterlambatan} mnt`,
    `${item.tidakHadir} hr`,
    `${item.persentaseKehadiran}%`,
  ]);

  autoTable(doc, {
    startY: 42,
    head: [[
      'No',
      'NIP',
      'Nama Pegawai',
      'Jabatan',
      'Unit Kerja',
      'Tepat Waktu',
      'Terlambat',
      'Durasi Telat',
      'Alpa / Tanpa Ket.',
      'Persentase',
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 35, 111],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 45 },
      3: { cellWidth: 40 },
      4: { cellWidth: 35 },
      5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 20, halign: 'center' },
      7: { cellWidth: 22, halign: 'center' },
      8: { cellWidth: 22, halign: 'center' },
      9: { cellWidth: 18, halign: 'center' },
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 2,
    },
  });

  // Tanda Tangan
  const finalY = (doc as any).lastAutoTable?.finalY || 160;
  if (finalY < 165) {
    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    doc.setFontSize(9);
    doc.text(`Dikeluarkan pada: ${tanggalCetak}`, 220, finalY + 12);
    doc.text('Mengetahui / Menyetujui,', 220, finalY + 17);
    doc.setFont('helvetica', 'bold');
    doc.text('Pimpinan Perusahaan XYZ', 220, finalY + 22);

    doc.text('(..................................................)', 220, finalY + 40);
  }

  // Save PDF
  doc.save(`Laporan_Presensi_Perusahaan_XYZ_${namaBulan}_${meta.tahun}.pdf`);
}
