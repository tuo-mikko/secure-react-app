import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import PostModel, { PostInput } from './models/post'; 
import { connectToMongo } from './config/db';

const app = express();
app.use(express.json())

let morgan = require('morgan')
app.use(morgan('dev'))

connectToMongo();

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({});
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const post = await PostModel.findById(id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.delete('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);
    if(deletedPost){
      res.json(deletedPost);
      res.status(204);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/api/posts/', async (req: Request<{}, {}, PostInput>, res: Response) => {
  
  const body = req.body

  if (!body.title) {
    res.status(400).json({ 
      error: 'Not all content present' 
    })
    return;
  }
  
  const newPost = new PostModel({
    title: body.title,
    userId: body.userId,
    message: body.message,
    postDateTime: new Date()
  });
  
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: 'Could not save post' });
  }
})

const unknownEndpoint = (req : Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

