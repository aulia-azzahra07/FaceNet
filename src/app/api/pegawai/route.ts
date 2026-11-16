import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  const auth = requireAuth(req, ['ADMIN', 'PIMPINAN']);
  if ('error' in auth) {
    return auth.error;
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || searchParams.get('q') || undefined;
  const unitKerja = searchParams.get('unitKerja') || searchParams.get('area') || undefined;
  const hakAkses = searchParams.get('hakAkses') || searchParams.get('hak_akses') || undefined;
  const statusPerangkat = (searchParams.get('statusPerangkat') as 'TERIKAT' | 'BELUM_TERIKAT' | 'SEMUA') || 'SEMUA';

  const employees = globalStore.getEmployees({
    search,
    unitKerja,
    hakAkses,
    statusPerangkat,
  });

  return NextResponse.json({
    success: true,
    data: employees,
    total: employees.length,
  });
}

export async function POST(req: Request) {
  const auth = requireAuth(req, ['ADMIN']);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const { nip, nama, jabatan, unitKerja, lokasiId, hakAkses, password, email, nomorTelepon } = body;

    if (!nip || !nama) {
      return NextResponse.json(
        { success: false, message: 'NIP dan Nama Lengkap wajib diisi.' },
        { status: 400 }
      );
    }

    const newEmp = globalStore.createEmployee(
      {
        nip,
        nama,
        jabatan: jabatan || 'Pegawai',
        unitKerja: unitKerja || 'Kantor Pusat PT XYZ',
        lokasiId: lokasiId || 'LOK-001',
        hakAkses: hakAkses || 'PEGAWAI',
        password,
        email,
        nomorTelepon,
      },
      auth.user.nama
    );

    return NextResponse.json({
      success: true,
      message: 'Data pegawai berhasil ditambahkan.',
      data: newEmp,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menambahkan pegawai.' },
      { status: 400 }
    );
  }
}
