import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET() {
  const locations = globalStore.getLocations();
  return NextResponse.json({
    success: true,
    data: locations,
  });
}
