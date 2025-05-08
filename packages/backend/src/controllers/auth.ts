import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';

import UserModel from '../models/user';
import RefreshModel from '../models/refreshToken';

const authRouter = Router();
// 15 min and 7 day tokens
const ACCESS_TTL_MS  = 15 * 60 * 1000;         
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; 

const cookieOpts = {
  httpOnly : true,
  sameSite : 'lax' as const,
  secure   : process.env.NODE_ENV === 'production',
};

function signAccessToken(payload: object): string {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ ...payload, jti: uuid() }, secret, { expiresIn: '15m' });
}

// Random string token
function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex'); 
}

// POST /api/login                                                   *
authRouter.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const PEPPER = process.env.PEPPER ?? '';

      if (!username || !password) {
        res.status(400).json({ error: 'Missing username or password' });
        return;
      }

      const user = await UserModel.findOne({ username });
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      const ok = await bcrypt.compare(password + PEPPER, user.passwordHash);
      if (!ok) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      // 15 minute access token
      const accessToken = signAccessToken({
        id: user._id,
        username: user.username,
      });

      // 7 day refresh token
      const refreshToken = generateRefreshToken();
      await RefreshModel.create({
        userId   : user._id,
        tokenHash: await bcrypt.hash(refreshToken, 12),
        expires  : new Date(Date.now() + REFRESH_TTL_MS),
      });

      res
        .cookie('token',   accessToken, { ...cookieOpts, maxAge: ACCESS_TTL_MS  })
        .cookie('refresh', refreshToken, { ...cookieOpts, maxAge: REFRESH_TTL_MS })
        .json({
          id: user._id.toString(),
          username: user.username,
          name: user.name,
        });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// POST api/refresh
authRouter.post(
  '/refresh',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const oldRefresh = req.cookies?.refresh;
      if (!oldRefresh) {
        res.status(401).json({ error: 'Missing refresh token' });
        return;
      }

      // find matching refresh doc
      const docs = await RefreshModel.find({ expires: { $gt: new Date() } });
      let record = null;
      for (const d of docs) {
        if (await bcrypt.compare(oldRefresh, d.tokenHash)) {
          record = d;
          break;
        }
      }
      if (!record) {
        res.status(401).json({ error: 'Invalid refresh token' });
        return;
      }

      // rotate refresh token
      const newRefresh = generateRefreshToken();
      record.tokenHash = await bcrypt.hash(newRefresh, 12);
      record.expires   = new Date(Date.now() + REFRESH_TTL_MS);
      await record.save();

      // new access token
      const accessToken = signAccessToken({
        id: record.userId,
        username: '', 
      });

      res
        .cookie('token',   accessToken, { ...cookieOpts, maxAge: ACCESS_TTL_MS  })
        .cookie('refresh', newRefresh, { ...cookieOpts, maxAge: REFRESH_TTL_MS })
        .json({ accessToken: 'refreshed' });
    } catch (err) {
      console.error('Refresh error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// POST /api/logout
authRouter.post(
  '/logout',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const refresh = req.cookies?.refresh;
      if (refresh) {
        // delete matching token
        const docs = await RefreshModel.find({});
        for (const d of docs) {
          if (await bcrypt.compare(refresh, d.tokenHash)) {
            await RefreshModel.findByIdAndDelete(d._id);
            break;
          }
        }
      }

      res
        .clearCookie('token',   cookieOpts)
        .clearCookie('refresh', cookieOpts)
        .status(204)
        .end();
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default authRouter;
