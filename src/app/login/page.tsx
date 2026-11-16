'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password) {
      setErrorMessage('NIP/Username dan Password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage('NIP/Username atau password tidak valid.');
        setLoading(false);
        return;
      }

      if (data.user.role === 'PIMPINAN') {
        router.push('/dashboard/laporan');
      } else {
        router.push('/dashboard/pemantauan');
      }
    } catch {
      setErrorMessage('Gagal terhubung ke server.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-xl shadow-blue-900/10">
        {/* Header Biru Tua & Muda */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-600 px-6 py-6 text-center text-white">
          <h1 className="text-xl font-bold tracking-tight">
            Administratif Face Recognition
          </h1>
          <p className="mt-1 text-xs font-medium text-sky-100">
            Perusahaan XYZ
          </p>
        </div>

        <div className="p-7">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-center text-xs font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-blue-950">
                NIP / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan NIP"
                className="w-full rounded-xl border border-blue-200 bg-sky-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-blue-950">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-blue-200 bg-sky-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-900 to-sky-600 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-blue-900/20 transition hover:from-blue-950 hover:to-sky-700 disabled:opacity-50"
            >
              {loading ? 'MEMPROSES...' : 'MASUK'}
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] font-medium text-slate-500">
            Hak akses (Admin / Pimpinan) ditentukan oleh akun
          </p>

          {/* Demo helper */}
          <div className="mt-5 border-t border-sky-100 pt-3.5 text-center text-[11px] text-slate-500">
            <span className="mb-1.5 block font-medium text-blue-900/70">
              Akun Demo (Klik untuk isi):
            </span>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsername('ADMIN001');
                  setPassword('admin123');
                  setErrorMessage('');
                }}
                className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 font-medium text-blue-800 transition hover:bg-sky-100"
              >
                Admin (ADMIN001)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('PIMPINAN001');
                  setPassword('pimpinan123');
                  setErrorMessage('');
                }}
                className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 font-medium text-blue-800 transition hover:bg-sky-100"
              >
                Pimpinan (PIMPINAN001)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
