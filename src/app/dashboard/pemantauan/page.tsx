'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PresensiRecord } from '@/types';

interface SummaryStats {
  totalPegawai: number;
  tepatWaktu: number;
  terlambat: number;
  belumPresensi: number;
}

export default function PemantauanPage() {
  const [records, setRecords] = useState<PresensiRecord[]>([]);
  const [summary, setSummary] = useState<SummaryStats>({
    totalPegawai: 0,
    tepatWaktu: 0,
    terlambat: 0,
    belumPresensi: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters: Tanggal & Area Kerja
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [areaFilter, setAreaFilter] = useState('SEMUA');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchPresensi = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tanggal) params.append('tanggal', tanggal);
      if (areaFilter !== 'SEMUA') params.append('unitKerja', areaFilter);

      const res = await fetch(`/api/presensi?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data || []);
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.error('Gagal memuat presensi:', err);
    } finally {
      setLoading(false);
    }
  }, [tanggal, areaFilter]);

  useEffect(() => {
    setPage(1);
    fetchPresensi();
  }, [fetchPresensi]);

  const formatJam = (jam?: string | null, iso?: string) => {
    if (jam) return jam.slice(0, 5);
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '-';
    }
  };

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const paginatedRecords = records.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-blue-200 pb-3.5">
        <div>
          <h2 className="text-xl font-bold text-blue-950">
            Pemantauan Data Presensi
          </h2>
          <p className="text-xs text-blue-700/80">
            Pantau kehadiran harian pegawai di lingkungan kantor Perusahaan XYZ
          </p>
        </div>
        <button
          onClick={fetchPresensi}
          className="rounded-xl bg-gradient-to-r from-blue-900 to-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:from-blue-950 hover:to-sky-700"
        >
          {loading ? 'Memuat...' : 'Muat Ulang'}
        </button>
      </div>

      {/* Filter Tanggal & Area Kerja */}
      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-semibold text-blue-900">
            Tanggal
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="rounded-xl border border-blue-200 bg-sky-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-blue-900">
            Area Kerja
          </label>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="rounded-xl border border-blue-200 bg-sky-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="SEMUA">Semua Area Kerja</option>
            <option value="Kantor Pusat PT XYZ">Kantor Pusat PT XYZ</option>
            <option value="Kantor Cabang A">Kantor Cabang A</option>
            <option value="Divisi Operasional & IT">Divisi Operasional & IT</option>
            <option value="Divisi Keuangan & SDM">Divisi Keuangan & SDM</option>
          </select>
        </div>
      </div>

      {/* Kartu Ringkasan: Total Pegawai, Hadir, Terlambat, Belum Presensi */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-900 to-blue-800 p-4 text-white shadow-sm">
          <p className="text-xs font-medium text-sky-200">Total Pegawai</p>
          <p className="mt-1 text-2xl font-extrabold">{summary.totalPegawai}</p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-sky-700">Hadir</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-900">
            {summary.tepatWaktu}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-sky-700">Terlambat</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-900">
            {summary.terlambat}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-sky-700">Belum Presensi</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-900">
            {summary.belumPresensi}
          </p>
        </div>
      </div>

      {/* Tabel Presensi: NIP, Nama, Jam Masuk, Jam Pulang, Status, Sinkronisasi */}
      <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-blue-900 to-blue-800 font-bold text-white">
              <th className="px-4 py-3">NIP</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Jam Masuk</th>
              <th className="px-4 py-3">Jam Pulang</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sinkronisasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Tidak ada data presensi
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => {
                const statusLabel =
                  r.status === 'HADIR_TEPAT_WAKTU'
                    ? 'Hadir'
                    : r.status === 'HADIR_TERLAMBAT'
                    ? 'Terlambat'
                    : 'Belum Presensi';

                const syncLabel =
                  r.status === 'BELUM_PRESENSI'
                    ? '-'
                    : r.syncStatus === 'TERKIRIM'
                    ? 'Tersinkron'
                    : 'Menunggu';

                return (
                  <tr key={r.id} className="transition hover:bg-sky-50/80">
                    <td className="px-4 py-3 font-mono font-medium text-blue-950">{r.nip}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.nama}</td>
                    <td className="px-4 py-3 text-slate-700">{formatJam(r.jamMasuk, r.timestamp)}</td>
                    <td className="px-4 py-3 text-slate-700">{r.jamPulang ? r.jamPulang.slice(0, 5) : '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          r.status === 'HADIR_TEPAT_WAKTU'
                            ? 'bg-sky-100 text-blue-900'
                            : r.status === 'HADIR_TERLAMBAT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-800">{syncLabel}</td>
                  </tr>
                );
              })
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
