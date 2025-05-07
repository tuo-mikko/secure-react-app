import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';

const loginRouter = Router();

interface LoginRequestBody {
    username: string;
    password: string;
  }

loginRouter.post('/', async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Not all content present' });
        }

        const user = await UserModel.findOne({ username });

        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

        if (!passwordCorrect) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error('Missing JWT_SECRET in environment variables');
            return res.status(500).json({ error: 'Internal server error' });
        }

        const userForToken = {
            username: user.username,
            id: user._id,
        };


        const token = jwt.sign(userForToken, jwtSecret);

        res.status(200).send({ token, username: user.username, name: user.name });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Something went wrong during login' });
    }
});


export default loginRouter