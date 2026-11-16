import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req, ['ADMIN']);
  if ('error' in auth) {
    return auth.error;
  }

  const { id } = await params;
  try {
    const body = await req.json().catch(() => ({}));
    const reason = body.alasan || 'Permintaan reset perangkat oleh pegawai';

    const updated = globalStore.resetPerangkat(id, reason, auth.user.nama);
    return NextResponse.json({
      success: true,
      message: `Perangkat untuk ${updated.nama} berhasil di-reset. Pegawai dapat mengaitkan perangkat baru pada login berikutnya.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mereset perangkat.' },
      { status: 400 }
    );
  }
}
