import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { requireAuth } from '@/lib/auth';
import { PresensiRecord } from '@/types';

export async function GET(req: Request) {
  const auth = requireAuth(req, ['ADMIN', 'PIMPINAN']);
  if ('error' in auth) {
    return auth.error;
  }

  const { searchParams } = new URL(req.url);
  const tanggal = searchParams.get('tanggal') || undefined;
  const unitKerja = searchParams.get('unitKerja') || undefined;
  const status = (searchParams.get('status') as any) || undefined;
  const syncStatus = (searchParams.get('syncStatus') as any) || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);

  const result = globalStore.getAttendances({
    tanggal,
    unitKerja,
    status,
    syncStatus,
    search,
    page,
    limit,
  });

  return NextResponse.json({
    success: true,
    data: result.records,
    summary: result.summary,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const record: PresensiRecord = body;

    if (!record.nip || !record.type || !record.timestamp) {
      return NextResponse.json(
        { success: false, message: 'NIP, jenis presensi, dan timestamp wajib diisi.' },
        { status: 400 }
      );
    }

    const saved = globalStore.submitAttendance(record);

    return NextResponse.json({
      success: true,
      message: 'Presensi berhasil dicatat di server pusat.',
      data: saved,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan presensi.' },
      { status: 400 }
    );
  }
}
