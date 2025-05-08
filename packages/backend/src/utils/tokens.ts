import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const signAccessToken = (payload: object) => {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ ...payload, jti: uuid() }, secret, { expiresIn: '15m' });
};

// Random token
export const generateRefreshToken = () =>
  crypto.randomBytes(64).toString('hex');

// Returns a Promise<String>
export const hashRefreshToken = (token: string) =>
  bcrypt.hash(token, 12); 

export const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };  