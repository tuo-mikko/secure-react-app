import express, { Request, Response } from 'express';

const app = express();
app.use(express.json())

interface Thread {
  id: number;
  postDateTime: Date;
  title: string;
  starterId: number;
  message: string;
}

interface ThreadInput {
  title: string;
  starterId: number;
  message: string;
}

// Dummy data
let threads: Thread[] = [
  {
    id: 1,
    postDateTime: new Date("2024-04-13T08:30:00Z"),
    title: 'White Lotus season 3 speculations',
    starterId: 24,
    message: "I am so excited!"
  },
  {
    id: 2,
    postDateTime: new Date("2024-04-13T08:30:00Z"),
    title: 'The second season was not that interesting...',
    starterId: 22,
    message: "Maybe it was just me, but I think it was not that great."
  }
];

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/threads', (req: Request, res: Response) => {
  res.json(threads);
});

app.get('/api/threads/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const thread = threads.find(thread => thread.id === id)
  thread ? res.json(thread) : res.status(404).end();
});

app.delete('/api/threads/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id)
  threads = threads.filter(thread => thread.id !== id)
  res.status(204).end()
});

app.post('/api/threads/', (req: Request, res: Response) => {
  const body = req.body

  if (!body.title) {
    res.status(400).json({ 
      error: 'Not all content present' 
    })
    return;
  }

  const dateTime = new Date()

  const thread = {
    id: generateId(),
    postDateTime: dateTime,
    title: body.title,
    starterId: body.starterId,
    message: body.message
  }

  threads = threads.concat(thread)
  res.status(200)
  res.json(thread)
})

function generateId(): number {
  const maxId = threads.length > 0
    ? Math.max(...threads.map(n => Number(n.id)))
    : 0
  return Number(maxId + 1)
}

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

