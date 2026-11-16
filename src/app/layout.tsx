import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Administratif Face Recognition — Perusahaan XYZ',
  description: 'Sistem Informasi Administratif Face Recognition Pegawai Lingkungan Kantor Perusahaan XYZ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
