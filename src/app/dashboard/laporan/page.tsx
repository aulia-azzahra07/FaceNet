'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RekapPegawai } from '@/types';
import { exportRekapToPdf } from '@/lib/pdf-export';
import { exportRekapToExcel } from '@/lib/xlsx-export';

interface RekapSummary {
  totalPegawai: number;
  rataRataKehadiran: number;
  totalTerlambat: number;
  totalAbsen: number;
}

export default function LaporanPage() {
  const currentDate = new Date();
  const [bulan, setBulan] = useState(currentDate.getMonth() + 1);
  const [tahun, setTahun] = useState(currentDate.getFullYear());
  const [unitKerja, setUnitKerja] = useState('SEMUA');
  const [role, setRole] = useState<'ADMIN' | 'PIMPINAN'>('ADMIN');

  const [rekap, setRekap] = useState<RekapPegawai[]>([]);
  const [summary, setSummary] = useState<RekapSummary>({
    totalPegawai: 0,
    rataRataKehadiran: 0,
    totalTerlambat: 0,
    totalAbsen: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setRole(data.user.role);
        }
      })
      .catch(() => {});
  }, []);

  const fetchRekap = useCallback(async (targetBulan: number, targetTahun: number, targetArea: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('bulan', targetBulan.toString());
      params.append('tahun', targetTahun.toString());
      if (targetArea !== 'SEMUA') params.append('unitKerja', targetArea);

      const res = await fetch(`/api/laporan/rekap?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRekap(data.data || []);
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data rekapitulasi:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRekap(bulan, tahun, unitKerja);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchRekap]);

  const handleTampilkan = () => {
    setPage(1);
    fetchRekap(bulan, tahun, unitKerja);
  };

  const handleExportPdf = () => {
    exportRekapToPdf(rekap, summary, {
      bulan,
      tahun,
      unitKerja: unitKerja === 'SEMUA' ? 'Semua Area Kerja' : unitKerja,
    });
  };

  const handleExportExcel = () => {
    exportRekapToExcel(rekap, {
      bulan,
      tahun,
      unitKerja: unitKerja === 'SEMUA' ? 'Semua Area Kerja' : unitKerja,
    });
  };

  const namaBulanList = [
    { no: 1, label: 'Januari' },
    { no: 2, label: 'Februari' },
    { no: 3, label: 'Maret' },
    { no: 4, label: 'April' },
    { no: 5, label: 'Mei' },
    { no: 6, label: 'Juni' },
    { no: 7, label: 'Juli' },
    { no: 8, label: 'Agustus' },
    { no: 9, label: 'September' },
    { no: 10, label: 'Oktober' },
    { no: 11, label: 'November' },
    { no: 12, label: 'Desember' },
  ];

  const isPimpinan = role === 'PIMPINAN';
  const totalPages = Math.max(1, Math.ceil(rekap.length / pageSize));
  const paginatedRekap = rekap.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-blue-200 pb-3.5">
        <div>
          <h2 className="text-xl font-bold text-blue-950">
            {isPimpinan ? 'Laporan Presensi' : 'Laporan Rekapitulasi Presensi'}
          </h2>
          <p className="text-xs text-blue-700/80">
            Rekapitulasi kehadiran pegawai Perusahaan XYZ per periode dan area kerja
          </p>
        </div>

        {/* Tombol Ekspor: Admin (PDF & Excel), Pimpinan (Unduh PDF saja) */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={rekap.length === 0}
            className="rounded-xl bg-gradient-to-r from-blue-900 to-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:from-blue-950 hover:to-sky-700 disabled:opacity-40"
          >
            {isPimpinan ? 'Unduh PDF' : 'Ekspor PDF'}
          </button>
          {!isPimpinan && (
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={rekap.length === 0}
              className="rounded-xl border border-blue-300 bg-white px-4 py-2 text-xs font-bold text-blue-900 shadow-sm transition hover:bg-sky-50 disabled:opacity-40"
            >
              Ekspor Excel
            </button>
          )}
        </div>
      </div>

      {/* Filter Periode & Area Kerja + Tombol Tampilkan */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-semibold text-blue-900">
            Periode (Bulan)
          </label>
          <select
            value={bulan}
            onChange={(e) => setBulan(parseInt(e.target.value, 10))}
            className="rounded-xl border border-blue-200 bg-sky-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {namaBulanList.map((b) => (
              <option key={b.no} value={b.no}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-blue-900">
            Tahun
          </label>
          <select
            value={tahun}
            onChange={(e) => setTahun(parseInt(e.target.value, 10))}
            className="rounded-xl border border-blue-200 bg-sky-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-blue-900">
            Area Kerja
          </label>
          <select
            value={unitKerja}
            onChange={(e) => setUnitKerja(e.target.value)}
            className="rounded-xl border border-blue-200 bg-sky-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="SEMUA">Semua Area Kerja</option>
            <option value="Kantor Pusat PT XYZ">Kantor Pusat PT XYZ</option>
            <option value="Kantor Cabang A">Kantor Cabang A</option>
            <option value="Divisi Operasional & IT">Divisi Operasional & IT</option>
            <option value="Divisi Keuangan & SDM">Divisi Keuangan & SDM</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleTampilkan}
          className="rounded-xl bg-gradient-to-r from-blue-900 to-sky-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:from-blue-950 hover:to-sky-700"
        >
          {loading ? 'Memuat...' : 'Tampilkan'}
        </button>
      </div>

      {/* Kartu Ringkasan: Rata-rata Kehadiran, Total Terlambat, Total Tidak Hadir */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-900 to-blue-800 p-4 text-white shadow-sm">
          <p className="text-xs font-medium text-sky-200">Rata-rata Kehadiran</p>
          <p className="mt-1 text-2xl font-extrabold">
            {summary.rataRataKehadiran}%
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-sky-700">Total Terlambat</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-900">
            {summary.totalTerlambat}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-sky-700">Total Tidak Hadir</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-900">
            {summary.totalAbsen}
          </p>
        </div>
      </div>

      {/* Tabel Rekap: NIP, Nama, Hadir, Terlambat, Tidak Hadir, % Kehadiran */}
      <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-blue-900 to-blue-800 font-bold text-white">
              <th className="px-4 py-3">NIP</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3 text-center">Hadir</th>
              <th className="px-4 py-3 text-center">Terlambat</th>
              <th className="px-4 py-3 text-center">Tidak Hadir</th>
              <th className="px-4 py-3 text-center">% Kehadiran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100">
            {paginatedRekap.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Tidak ada data rekapitulasi presensi
                </td>
              </tr>
            ) : (
              paginatedRekap.map((item) => (
                <tr key={item.pegawaiId} className="transition hover:bg-sky-50/80">
                  <td className="px-4 py-3 font-mono font-medium text-blue-950">{item.nip}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.nama}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-900">{item.hadirTepatWaktu}</td>
                  <td className="px-4 py-3 text-center font-semibold text-sky-700">{item.hadirTerlambat}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-600">{item.tidakHadir}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-900">
                      {item.persentaseKehadiran}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginasi ‹ 1 2 3 › */}
      <div className="flex items-center justify-end gap-1.5 text-xs">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold text-blue-900 transition hover:bg-sky-50 disabled:opacity-40"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`rounded-lg border px-3 py-1.5 font-semibold transition ${
              page === num
                ? 'border-blue-900 bg-blue-900 text-white shadow-sm'
                : 'border-blue-200 bg-white text-blue-900 hover:bg-sky-50'
            }`}
          >
            {num}
          </button>
        ))}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold text-blue-900 transition hover:bg-sky-50 disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
}
