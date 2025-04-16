import mongoose, { Schema, Document, Model } from 'mongoose';

export interface PostDocument extends Document {
  title: string;
  starterId: number;
  message: string;
  postDateTime: Date;
}

export interface PostInput {
  title: string;
  starterId: number;
  message: string;
}

// Define schema
const postSchema: Schema<PostDocument> = new Schema({
  title: { type: String, required: true },
  starterId: { type: Number, required: true },
  message: { type: String, required: true },
  postDateTime: { type: Date, default: Date.now },
});

// Create model
const PostModel: Model<PostDocument> = mongoose.model<PostDocument>('Post', postSchema);

export default PostModel;