import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req, ['ADMIN', 'PIMPINAN']);
  if ('error' in auth) {
    return auth.error;
  }

  const { id } = await params;
  const emp = globalStore.getEmployeeById(id);
  if (!emp) {
    return NextResponse.json(
      { success: false, message: 'Pegawai tidak ditemukan.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: emp,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req, ['ADMIN']);
  if ('error' in auth) {
    return auth.error;
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const updated = globalStore.updateEmployee(id, body, auth.user.nama);
    return NextResponse.json({
      success: true,
      message: 'Data pegawai berhasil diperbarui.',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memperbarui data pegawai.' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req, ['ADMIN']);
  if ('error' in auth) {
    return auth.error;
  }

  const { id } = await params;
  try {
    globalStore.deleteEmployee(id, auth.user.nama);
    return NextResponse.json({
      success: true,
      message: 'Data pegawai berhasil dihapus.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus data pegawai.' },
      { status: 400 }
    );
  }
}
