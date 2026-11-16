import { NextRequest } from 'next/server';
import crypto from 'crypto';

const MASTER_ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'hidewood-atelier-master-secure-9900';

export function verifyAdminToken(req: NextRequest): boolean {
  const token = req.headers.get('x-atelier-admin-key');
  if (!token) return false;
  return token === MASTER_ADMIN_SECRET;
}

export function generateAdminToken(): string {
  return MASTER_ADMIN_SECRET;
}