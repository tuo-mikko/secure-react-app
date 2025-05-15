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
// The model attempts to reach a higher level of security by defining the
// types more tightly, and limiting the amount of input accepted from the user
const postSchema: Schema<PostDocument> = new Schema({
  title: { type: String, required: true, maxlength:120},
  userId: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  message: { type: String, required: true, maxlength:450 },
  postDateTime: { type: Date, default: Date.now },
});

// Modify what data ends up in the frontend
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