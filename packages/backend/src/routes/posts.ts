// Post Router
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import PostModel, { PostInput } from '../models/post';
import UserModel from '../models/user';
import { authenticate, AuthenticatedRequest } from '../middlewares/authenticate';
import logger from '../utils/logger';

const postsRouter = Router();

// GET /api/posts  Auth required
postsRouter.get(
  '/',
  authenticate,
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const posts = await PostModel
        .find({})
        .populate('userId', 'username')
        .lean();
      res.json(posts);
    } catch {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }
);

// GET /api/posts/latest Public route
postsRouter.get('/latest', async (_req: Request, res: Response) => {
  try {
    const latest = await PostModel
      .find({})
      .sort({ postDateTime: -1 })
      .limit(5)
      .populate('userId', 'username')
      .lean();
    res.json(latest);
  } catch {
    res.status(500).json({ error: 'Failed to fetch latest posts' });
  }
});

// POST /api/posts Auth required
postsRouter.post(
  '/',
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const { title, message } = req.body as PostInput;
    const { user } = req as unknown as AuthenticatedRequest;
    const userId = user.id;

    if (!title || !message) {
      res.status(400).json({ error: 'Missing title or message' });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    try {
      const newPost = await new PostModel({
        title,
        message,
        userId,
        postDateTime: new Date(),
      }).save();

      await UserModel.findByIdAndUpdate(userId, {
        $push: { posts: newPost._id },
      });

      logger.info('POST_CREATED', { userId, postId: newPost.id.toString() });
      res.status(201).json(newPost);
    } catch (err) {
      logger.error('POST_CREATE_ERROR', { error: err });
      res.status(500).json({ error: 'Could not save post' });
    }
  }
);

// DELETE /api/posts/:id Auth required
postsRouter.delete(
  '/:id',
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const { user } = req as unknown as AuthenticatedRequest;
    if (post.userId.toString() !== user.id) {
      logger.warn('DELETE_DENIED', { userId: user.id, postId: post.id.toString() });
      res.status(403).json({ error: 'Not allowed' });
      return;
    }

    await post.deleteOne();
    logger.info('POST_DELETED', { userId: user.id, postId: post.id.toString() });
    res.status(204).end();
  }
);

export default postsRouter;
