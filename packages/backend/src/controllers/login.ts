import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';

const loginRouter = Router();

interface LoginRequestBody {
  username: string;
  password: string;
}

loginRouter.post(
  '/',
  async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response
  ): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'Not all content present' });
        return;
      }

      const user = await UserModel.findOne({ username });

      if (!user || !user.passwordHash) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      const passwordCorrect = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (!passwordCorrect) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }


      // Create token
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        console.error('Missing JWT_SECRET in environment variables');
        res.status(500).json({ error: 'Server error' });
        return;
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = jwt.sign(userForToken, jwtSecret);

      // Success
      res.status(200).json({
        token,
        username: user.username,
        name: user.name,
      });
    } catch (error) {
      console.error('Login error:', error);
      res
        .status(500)
        .json({ error: 'Something went wrong during login' });
    }
  }
);

export default loginRouter;
