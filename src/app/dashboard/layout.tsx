'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { TokenPayload } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.user) {
          router.replace('/login');
          return;
        }
        setUser(data.user);
        setLoading(false);

        if (data.user.role === 'PIMPINAN') {
          if (pathname === '/dashboard/pemantauan' || pathname === '/dashboard/pegawai') {
            router.replace('/dashboard/laporan');
          }
        }
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-sky-50 text-sm font-medium text-blue-900">
        Memuat halaman...
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  const navLinks = [
    ...(isAdmin
      ? [
          {
            href: '/dashboard/pemantauan',
            label: 'Pemantauan Presensi',
          },
          {
            href: '/dashboard/pegawai',
            label: 'Data Pegawai',
          },
        ]
      : []),
    {
      href: '/dashboard/laporan',
      label: isAdmin ? 'Laporan Rekapitulasi' : 'Laporan Presensi',
    },
  ];

  return (
    <div className="flex min-h-screen bg-sky-50/70 text-slate-900">
      {/* Sidebar Kiri dengan gradasi Biru Tua */}
      <aside className="flex w-64 flex-col justify-between bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 p-5 text-white shadow-lg">
        <div>
          <div className="mb-6 border-b border-blue-700/60 pb-4">
            <h1 className="text-base font-bold tracking-tight text-white leading-snug">
              Administratif Face Recognition
            </h1>
            <p className="mt-1 text-xs font-semibold text-sky-300">
              Perusahaan XYZ
            </p>
            <p className="mt-0.5 text-[11px] text-sky-200/80">
              {isAdmin ? 'Portal Administrator' : 'Portal Pimpinan'}
            </p>
          </div>

          <nav className="space-y-2">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-950/30 ring-1 ring-sky-300/40'
                      : 'text-sky-100/90 hover:bg-blue-800/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar: Keluar */}
        <div className="border-t border-blue-700/60 pt-4 text-xs">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-sky-400/40 bg-blue-800/60 py-2 text-xs font-bold text-sky-100 transition hover:bg-sky-500 hover:text-white hover:border-sky-400"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 p-6 sm:p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
