import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nip, faceEmbedding, pinHash, deviceId } = body;

    if (!nip || !deviceId) {
      return NextResponse.json(
        { success: false, message: 'NIP dan Device ID wajib disertakan.' },
        { status: 400 }
      );
    }

    const updated = globalStore.registerCredentials({
      nip,
      faceEmbedding,
      pinHash,
      deviceId,
    });

    return NextResponse.json({
      success: true,
      message: `Registrasi biometrik dan pengikatan perangkat untuk ${updated.nama} berhasil disimpan ke server pusat.`,
      data: {
        id: updated.id,
        nip: updated.nip,
        nama: updated.nama,
        deviceId: updated.deviceId,
        registeredAt: updated.registeredAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mendaftarkan kredensial perangkat.' },
      { status: 400 }
    );
  }
}
