import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';

import UserModel from '../models/user';
import RefreshModel from '../models/refreshToken';
import logger from '../utils/logger';

import { authenticate, AuthenticatedRequest } from '../middlewares/authenticate';


const authRouter = Router();

const ACCESS_TTL_MS  = 15 * 60 * 1000;              // 15 min
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;    // 30 days

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure  : process.env.NODE_ENV === 'production',
};

// helpers
const signAccessToken = (pl: object) =>
  jwt.sign({ ...pl, jti: uuid() }, process.env.JWT_SECRET!, { expiresIn: '15m' });

const genRefresh = () => crypto.randomBytes(64).toString('hex');

// POST /api/login
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const PEPPER = process.env.PEPPER ?? '';

  try {
    if (!username || !password) {
      res.status(400).json({ error: 'Missing username or password' });
      return;
    }

    const user = await UserModel.findOne({ username });
    if (!user || !user.passwordHash) {
      logger.warn('LOGIN_FAIL', { ip: req.ip, username });
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const ok = await bcrypt.compare(password + PEPPER, user.passwordHash);
    if (!ok) {
      logger.warn('LOGIN_FAIL', { ip: req.ip, username });
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // tokens
    const accessToken  = signAccessToken({ id: user._id, username });
    const refreshToken = genRefresh();
    await RefreshModel.create({
      userId   : user._id,
      tokenHash: await bcrypt.hash(refreshToken, 12),
      expires  : new Date(Date.now() + REFRESH_TTL_MS),
    });

    logger.info('LOGIN_SUCCESS', { ip: req.ip, userId: user._id.toString() });

    res
      .cookie('token',   accessToken,  { ...cookieOpts, maxAge: ACCESS_TTL_MS  })
      .cookie('refresh', refreshToken, { ...cookieOpts, maxAge: REFRESH_TTL_MS })
      .json({ id: user._id, username, name: user.name });
  } catch (err) {
    logger.error('LOGIN_ERROR', { error: err });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/refresh
authRouter.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const oldRefresh = req.cookies?.refresh;
  if (!oldRefresh) {
    logger.warn('REFRESH_MISSING', { ip: req.ip });
    res.status(401).json({ error: 'Missing refresh token' });
    return;
  }

  try {
    const docs = await RefreshModel.find({ expires: { $gt: new Date() } });
    const record = await Promise.all(docs.map(async d => ({
      doc: d,
      match: await bcrypt.compare(oldRefresh, d.tokenHash)
    }))).then(arr => arr.find(x => x.match)?.doc);

    if (!record) {
      logger.warn('REFRESH_REJECT', { ip: req.ip });
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    // rotate token 
    const newRefresh = genRefresh();
    record.tokenHash = await bcrypt.hash(newRefresh, 12);
    record.expires   = new Date(Date.now() + REFRESH_TTL_MS);
    await record.save();

    const accessToken = signAccessToken({ id: record.userId });

    logger.info('REFRESH_SUCCESS', { ip: req.ip, userId: record.userId.toString() });

    res
      .cookie('token',   accessToken,  { ...cookieOpts, maxAge: ACCESS_TTL_MS  })
      .cookie('refresh', newRefresh,   { ...cookieOpts, maxAge: REFRESH_TTL_MS })
      .json({ accessToken: 'refreshed' });
  } catch (err) {
    logger.error('REFRESH_ERROR', { error: err });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/logout
authRouter.post('/logout', async (req: Request, res: Response): Promise<void> => {
  const refresh = req.cookies?.refresh;

  try {
    if (refresh) {
      const docs = await RefreshModel.find({});
      for (const d of docs) {
        if (await bcrypt.compare(refresh, d.tokenHash)) {
          await RefreshModel.findByIdAndDelete(d._id);
          break;
        }
      }
    }

    logger.info('LOGOUT', { ip: req.ip, userId: req.cookies?.token ?? 'unknown' });

    res
      .clearCookie('token',   cookieOpts)
      .clearCookie('refresh', cookieOpts)
      .status(204)
      .end();
  } catch (err) {
    logger.error('LOGOUT_ERROR', { error: err });
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/me  
authRouter.get('/me', authenticate, (req: Request, res: Response): void => {
    const { user } = req as unknown as AuthenticatedRequest;
    res.json({ id: user.id, username: user.username }); 
  }
);

export default authRouter;