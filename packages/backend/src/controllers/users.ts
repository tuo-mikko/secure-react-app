import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/user';

const usersRouter = Router();

interface CreateUserRequestBody {
  username: string;
  name: string;
  password: string;
}
const PEPPER = process.env.PEPPER || '';

usersRouter.post(
  '/',
  async (req: Request<{}, {}, CreateUserRequestBody>, res: Response): Promise<void> => {
    try {
      const { username, name, password } = req.body;

      // Check that everything is there
      if (!username || !name || !password) {
        res.status(400).json({ error: 'Missing username, name, or password' });
        return;
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        res.status(409).json({ error: 'Username already taken' });
        return;
      }

      // Add pepper before hashing
      const saltedPassword = password + PEPPER;
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(saltedPassword, saltRounds);

      const user = new UserModel({
        username,
        name,
        passwordHash,
      });

      // Add user to database
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (error) {
      console.error('User creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

usersRouter.get('/', async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (error) {
    console.error('Fetching users failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default usersRouter;
