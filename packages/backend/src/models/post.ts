import mongoose, { Schema, Document, Model } from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

export interface PostDocument extends Document {
  title: string;
  userId: mongoose.Types.ObjectId;
  message: string;
  postDateTime: Date;
}

export interface PostInput {
  title: string;
  userId: string;
  message: string;
}

// Define schema
const postSchema: Schema<PostDocument> = new Schema({
  title: { type: String, required: true },
  userId: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  message: { type: String, required: true },
  postDateTime: { type: Date, default: Date.now },
});


postSchema.set('toJSON', {
    transform: (_document, returnedObject: any) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  });   


// Create model
const PostModel: Model<PostDocument> = mongoose.model<PostDocument>('Post', postSchema);

export default PostModel;