import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/user';

const usersRouter = Router();

interface CreateUserRequestBody {
  username: string;
  name: string;
  password: string;
}

usersRouter.post('/', async (req: Request<{}, {}, CreateUserRequestBody>, res: Response) => {
    const { username, name, password } = req.body;
  
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
  
    const user = new UserModel({
      username,
      name,
      passwordHash,
    });
  
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  });
  
  export default usersRouter;