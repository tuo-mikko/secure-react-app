import express, { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';

const app = express();
app.use(express.json())

let morgan = require('morgan')
app.use(morgan('dev'))


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://mikkoAdmin:${password}@whitelotusforum.w5vfwep.mongodb.net/forumPosts?retryWrites=true&w=majority&appName=WhiteLotusForum`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

interface PostDocument extends Document {
    title: string;
    starterId: number;
    message: string;
    postDateTime: Date;
}

interface PostInput {
  title: string;
  starterId: number;
  message: string;
}

const postSchema: Schema<PostDocument> = new Schema({
  title: { type: String, required: true },
  starterId: { type: Number, required: true },
  message: { type: String, required: true },
  postDateTime: { type: Date, default: Date.now }
});

const PostModel = mongoose.model<PostDocument>('Post', postSchema);

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
    starterId: body.starterId,
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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

