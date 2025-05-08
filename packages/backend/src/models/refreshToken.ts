import mongoose, { Schema, Document, Model } from 'mongoose';

export interface RefreshDoc extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expires: Date;
}

const refreshSchema: Schema<RefreshDoc> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  expires: { type: Date, required: true },
});

const RefreshModel: Model<RefreshDoc> = mongoose.model('RefreshToken', refreshSchema);
export default RefreshModel;
