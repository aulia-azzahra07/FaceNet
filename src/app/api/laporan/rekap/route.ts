import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  const auth = requireAuth(req, ['ADMIN', 'PIMPINAN']);
  if ('error' in auth) {
    return auth.error;
  }

  const { searchParams } = new URL(req.url);
  const now = new Date();
  const bulan = parseInt(searchParams.get('bulan') || (now.getMonth() + 1).toString(), 10);
  const tahun = parseInt(searchParams.get('tahun') || now.getFullYear().toString(), 10);
  const unitKerja = searchParams.get('unitKerja') || undefined;

  const result = globalStore.getRekapitulasi({ bulan, tahun, unitKerja });

  return NextResponse.json({
    success: true,
    data: result.rekap,
    summary: result.summary,
    meta: {
      bulan,
      tahun,
      unitKerja: unitKerja || 'Semua Unit Kerja',
    },
  });
}
