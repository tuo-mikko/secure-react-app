import mongoose from 'mongoose';

export const connectToMongo = async () => {

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_CLUSTER,
  MONGO_DB,
} = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_CLUSTER || !MONGO_DB) {
  console.error('Missing MongoDB environment variables');
  process.exit(1);
}

const mongoUri = `mongodb+srv://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority&appName=WhiteLotusForum`;

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
};