import { API_KEY } from '@/config';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';

export function generateJWT(payload, duration: string): string {
  return sign(payload, String(API_KEY), { expiresIn: duration });
}
