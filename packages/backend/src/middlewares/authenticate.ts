import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


// expected JWT payload shape
interface TokenPayload {
  id: string;
  username: string;
}

// extend request to include a `user` property once authenticated
export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

// protect routes with user authentication
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // read token from cookie
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: 'Authentication token missing' });
    return;
  }

  try {
    // check secret
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');
    const payload = jwt.verify(token, secret) as TokenPayload;

    // verify + decode the token into payload shape
    ;(req as AuthenticatedRequest).user = payload;

    next();
  } catch {
    // if token was invalid
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
