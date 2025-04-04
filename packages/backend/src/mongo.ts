import mongoose, { Schema, Document } from 'mongoose';

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

const postSchema: Schema<PostDocument> = new Schema({
  title: { type: String, required: true },
  starterId: { type: Number, required: true },
  message: { type: String, required: true },
  postDateTime: { type: Date, default: Date.now }
}); 
const Post = mongoose.model<PostDocument>('Post', postSchema);

const newPost = new Post({
  postDateTime: new Date("2024-04-13T08:30:00Z"),
  title: 'White Lotus season 3 speculations',
  starterId: 24,
  message: "I am so excited!"
});

(async () => {
  try {
    const result = await newPost.save();
    console.log('Post saved:', result);
  } catch (err) {
    console.error('Error saving post:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
})();