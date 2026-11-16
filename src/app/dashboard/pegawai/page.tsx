'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Pegawai } from '@/types';

export default function PegawaiPage() {
  const [employees, setEmployees] = useState<Pegawai[]>([]);
  const [search, setSearch] = useState('');
  const [hakAksesFilter, setHakAksesFilter] = useState('SEMUA');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Form state (Gambar 4.17)
  const [editingEmployee, setEditingEmployee] = useState<Pegawai | null>(null);
  const [formData, setFormData] = useState({
    nip: '',
    nama: '',
    password: '',
    hakAkses: 'PEGAWAI',
    unitKerja: 'Kantor Pusat PT XYZ',
  });
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (hakAksesFilter !== 'SEMUA') params.append('hakAkses', hakAksesFilter);

      const res = await fetch(`/api/pegawai?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEmployees(data.data || []);
      }
    } catch (err) {
      console.error('Gagal mengambil data pegawai:', err);
    }
  }, [search, hakAksesFilter]);

  useEffect(() => {
    setPage(1);
    fetchEmployees();
  }, [fetchEmployees]);

  // FR-EMP-04: Tombol + Tambah Pegawai mengosongkan form untuk input baru
  const handleResetForm = () => {
    setEditingEmployee(null);
    setFormData({
      nip: '',
      nama: '',
      password: '',
      hakAkses: 'PEGAWAI',
      unitKerja: 'Kantor Pusat PT XYZ',
    });
    setNotice(null);
  };

  // FR-EMP-06: Aksi Ubah memuat data pegawai ke form; field Password Awal tidak ditampilkan ulang
  const handleSelectEdit = (emp: Pegawai) => {
    setEditingEmployee(emp);
    setFormData({
      nip: emp.nip,
      nama: emp.nama,
      password: '',
      hakAkses: emp.hakAkses || 'PEGAWAI',
      unitKerja: emp.unitKerja || 'Kantor Pusat PT XYZ',
    });
    setNotice(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    if (!formData.nip.trim() || !formData.nama.trim()) {
      setNotice({ type: 'error', text: 'NIP dan Nama Lengkap wajib diisi.' });
      return;
    }

    setSubmitting(true);
    try {
      if (editingEmployee) {
        const res = await fetch(`/api/pegawai/${editingEmployee.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message);
        setNotice({ type: 'success', text: 'Data pegawai berhasil diperbarui.' });
      } else {
        const res = await fetch('/api/pegawai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message);
        setNotice({ type: 'success', text: 'Pegawai baru berhasil disimpan.' });
        handleResetForm();
      }
      fetchEmployees();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Gagal menyimpan data pegawai.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (emp: Pegawai) => {
    if (!confirm(`Hapus data pegawai ${emp.nama} (${emp.nip})?`)) return;
    try {
      const res = await fetch(`/api/pegawai/${emp.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      if (editingEmployee?.id === emp.id) {
        handleResetForm();
      }
      setNotice({ type: 'success', text: `Pegawai ${emp.nama} berhasil dihapus.` });
      fetchEmployees();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Gagal menghapus pegawai.' });
    }
  };

  // FR-EMP-10: Reset Perangkat melepas ikatan perangkat pegawai
  const handleResetDevice = async () => {
    if (!editingEmployee) {
      setNotice({ type: 'error', text: 'Pilih pegawai terlebih dahulu melalui tombol Ubah.' });
      return;
    }
    if (!confirm(`Reset ikatan perangkat untuk pegawai ${editingEmployee.nama} (${editingEmployee.nip})?`)) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/pegawai/${editingEmployee.id}/reset-perangkat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alasan: 'Reset perangkat oleh Admin' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      setEditingEmployee(data.data);
      setNotice({ type: 'success', text: `Perangkat ${editingEmployee.nama} berhasil di-reset.` });
      fetchEmployees();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Gagal mereset perangkat.' });
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(employees.length / pageSize));
  const paginatedEmployees = employees.slice((page - 1) * pageSize, page * pageSize);

  const formatRoleLabel = (role: string) => {
    if (role === 'ADMIN') return 'Admin';
    if (role === 'PIMPINAN') return 'Pimpinan';
    return 'Pegawai';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-blue-200 pb-3.5">
        <div>
          <h2 className="text-xl font-bold text-blue-950">
            Kelola Data Pegawai
          </h2>
          <p className="text-xs text-blue-700/80">
            Pengelolaan informasi pegawai, hak akses, area kerja, dan perangkat
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetForm}
          className="rounded-xl bg-gradient-to-r from-blue-900 to-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:from-blue-950 hover:to-sky-700"
        >
          + Tambah Pegawai
        </button>
      </div>

      {notice && (
        <div
          className={`rounded-xl border px-4 py-2.5 text-xs font-medium ${
            notice.type === 'success'
              ? 'border-sky-300 bg-sky-50 text-blue-900'
              : 'border-red-300 bg-red-50 text-red-700'
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Filter & Tabel Daftar Pegawai */}
        <div className="space-y-4 lg:col-span-2">
          {/* Pencarian & Filter Hak Akses */}
          <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="flex-1 min-w-[180px]">
              <label className="mb-1 block text-xs font-semibold text-blue-900">
                Cari NIP / Nama
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari NIP atau nama..."
                className="w-full rounded-xl border border-blue-200 bg-sky-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-blue-900">
                Hak Akses
              </label>
              <select
                value={hakAksesFilter}
                onChange={(e) => setHakAksesFilter(e.target.value)}
                className="rounded-xl border border-blue-200 bg-sky-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="SEMUA">Semua</option>
                <option value="PEGAWAI">Pegawai</option>
                <option value="ADMIN">Admin</option>
                <option value="PIMPINAN">Pimpinan</option>
              </select>
            </div>
          </div>

          {/* Tabel Pegawai: NIP, Nama, Hak Akses, Area Kerja, Aksi */}
          <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-blue-900 to-blue-800 font-bold text-white">
                  <th className="px-3.5 py-3">NIP</th>
                  <th className="px-3.5 py-3">Nama</th>
                  <th className="px-3.5 py-3">Hak Akses</th>
                  <th className="px-3.5 py-3">Area Kerja</th>
                  <th className="px-3.5 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Tidak ada data pegawai
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className={`transition hover:bg-sky-50/80 ${
                        editingEmployee?.id === emp.id ? 'bg-sky-100/70' : ''
                      }`}
                    >
                      <td className="px-3.5 py-3 font-mono font-medium text-blue-950">{emp.nip}</td>
                      <td className="px-3.5 py-3 font-medium text-slate-800">{emp.nama}</td>
                      <td className="px-3.5 py-3">
                        <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-900">
                          {formatRoleLabel(emp.hakAkses)}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-slate-700">{emp.unitKerja}</td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="inline-flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSelectEdit(emp)}
                            className="rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-blue-800 transition hover:bg-sky-100"
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(emp)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            Hapus
                          </button>
                        </div>
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

        {/* Kolom Kanan: Form Pegawai (Gambar 4.17) */}
        <div className="h-fit overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-900 to-sky-600 px-5 py-3.5 text-white">
            <h3 className="text-sm font-bold">
              {editingEmployee ? 'Form Ubah Pegawai' : 'Form Tambah Pegawai'}
            </h3>
          </div>

          <form onSubmit={handleSave} className="space-y-3.5 p-5 text-xs">
            <div>
              <label className="mb-1 block font-semibold text-blue-950">
                NIP
              </label>
              <input
                type="text"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                placeholder="Masukkan NIP"
                className="w-full rounded-xl border border-blue-200 bg-sky-50/50 px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-blue-950">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Masukkan Nama Lengkap"
                className="w-full rounded-xl border border-blue-200 bg-sky-50/50 px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-blue-950">
                Password Awal
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingEmployee ? 'Kosongkan jika tidak diubah' : 'Masukkan password awal'}
                className="w-full rounded-xl border border-blue-200 bg-sky-50/50 px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-blue-950">
                Hak Akses
              </label>
              <select
                value={formData.hakAkses}
                onChange={(e) => setFormData({ ...formData, hakAkses: e.target.value })}
                className="w-full rounded-xl border border-blue-200 bg-sky-50/50 px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="PEGAWAI">Pegawai</option>
                <option value="ADMIN">Admin</option>
                <option value="PIMPINAN">Pimpinan</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-blue-950">
                Area Kerja
              </label>
              <select
                value={formData.unitKerja}
                onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })}
                className="w-full rounded-xl border border-blue-200 bg-sky-50/50 px-3 py-2 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="Kantor Pusat PT XYZ">Kantor Pusat PT XYZ</option>
                <option value="Kantor Cabang A">Kantor Cabang A</option>
                <option value="Divisi Operasional & IT">Divisi Operasional & IT</option>
                <option value="Divisi Keuangan & SDM">Divisi Keuangan & SDM</option>
              </select>
            </div>

            {editingEmployee && (
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[11px] font-medium text-blue-900">
                Status Perangkat: {editingEmployee.deviceId ? `Terikat (${editingEmployee.deviceId})` : 'Belum Terikat'}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-900 to-sky-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:from-blue-950 hover:to-sky-700 disabled:opacity-50"
              >
                Simpan
              </button>
              <button
                type="button"
                disabled={!editingEmployee || submitting}
                onClick={handleResetDevice}
                className="flex-1 rounded-xl border border-blue-300 bg-sky-50 py-2.5 text-xs font-bold text-blue-900 transition hover:bg-sky-100 disabled:opacity-40"
              >
                Reset Perangkat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
