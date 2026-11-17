import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ nip: string }> }
) {
  const { nip } = await params;
  const emp = globalStore.getEmployeeByNip(nip);

  if (!emp) {
    return NextResponse.json(
      { success: false, message: `Pegawai dengan NIP ${nip} tidak ditemukan di server.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: emp.id,
      nip: emp.nip,
      nama: emp.nama,
      jabatan: emp.jabatan,
      unitKerja: emp.unitKerja,
      lokasiId: emp.lokasiId,
      deviceId: emp.deviceId,
      isActive: emp.isActive,
      hasPin: Boolean(emp.pinHash),
      hasFace: Boolean(emp.faceEmbedding && emp.faceEmbedding.length > 0),
      faceEmbedding: emp.faceEmbedding || null,
      pinHash: emp.pinHash || null,
    },
  });
}
