import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import PostModel, { PostInput } from '../models/post';
import UserModel from '../models/user';
import { authenticate, AuthenticatedRequest } from '../middlewares/authenticate';

const postsRouter = Router();

/* GET /api/posts */
postsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({});
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

/* GET /api/posts/:id */
postsRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findById(id);
    post
      ? res.json(post)
      : res.status(404).json({ error: 'Post not found' });
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

/* DELETE /api/posts/:id */
postsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await PostModel.findByIdAndDelete(req.params.id);
    deleted
      ? res.status(204).end()
      : res.status(404).json({ error: 'Post not found' });
  } catch {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

/* POST /api/posts */
postsRouter.post(
    '/',
    authenticate,
    async (req, res) => {
      const { title, message } = req.body;
      const { user } = req as AuthenticatedRequest;
      const userId = user.id;
  
      if (!title || !message) {
        res.status(400).json({ error: 'Missing title or message' });
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ error: 'Invalid user ID in token' });
        return;
      }
  
      try {
        const newPost = await new PostModel({
          title,
          userId,          
          message,
          postDateTime: new Date(),
        }).save();
  
        await UserModel.findByIdAndUpdate(userId, {
          $push: { posts: newPost._id },
        });
  
        res.status(201).json(newPost);
      } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Could not save post' });
      }
    }
  );
  
  export default postsRouter;