import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Berhasil keluar dari sistem.',
  });

  response.cookies.set({
    name: 'civil_auth_token',
    value: '',
    path: '/',
    maxAge: 0,
  });

  return response;
}
