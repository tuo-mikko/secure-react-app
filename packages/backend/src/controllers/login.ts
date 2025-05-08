import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';

const loginRouter = Router();

interface LoginRequestBody {
    username: string;
    password: string;
  }



export default loginRouter