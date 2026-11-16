import jwt from 'jsonwebtoken';
import { HakAkses } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'civil-presence-jwt-secret-key-2026-secure';

export interface TokenPayload {
  id: string;
  nama: string;
  nip: string;
  role: HakAkses;
  unitKerja: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check cookie
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    if (cookies['civil_auth_token']) {
      return cookies['civil_auth_token'];
    }
  }

  return null;
}

export function getUserFromRequest(req: Request): TokenPayload | null {
  const token = extractTokenFromHeader(req);
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(req: Request, allowedRoles?: HakAkses[]): { user: TokenPayload } | { error: Response } {
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      error: new Response(
        JSON.stringify({ success: false, message: 'Tidak terotentikasi. Silakan masuk terlebih dahulu.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      error: new Response(
        JSON.stringify({ success: false, message: 'Akses ditolak. Peran Anda tidak memiliki hak akses ini.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  return { user };
}
