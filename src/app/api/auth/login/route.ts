import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username/NIP dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const authResult = globalStore.authenticate(username, password);
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'NIP/Username atau password tidak valid.' },
        { status: 401 }
      );
    }

    if (authResult.user.role !== 'ADMIN' && authResult.user.role !== 'PIMPINAN') {
      return NextResponse.json(
        { success: false, message: 'Akun ini tidak memiliki hak akses untuk masuk ke aplikasi web.' },
        { status: 403 }
      );
    }

    const token = signToken({
      id: authResult.user.id,
      nama: authResult.user.nama,
      nip: authResult.user.nip,
      role: authResult.user.role,
      unitKerja: authResult.user.unitKerja,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      token,
      user: authResult.user,
    });

    // Set secure cookie
    response.cookies.set({
      name: 'civil_auth_token',
      value: token,
      httpOnly: false, // accessible to client for simplicity
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server saat login.' },
      { status: 500 }
    );
  }
}
