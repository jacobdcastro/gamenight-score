import mongoose from 'mongoose';
import config from 'config';

const NODE_ENV = process.env.NODE_ENV;
const key = NODE_ENV === 'production' ? 'mongoURIProd' : 'mongoURIDev';
const db: string = config.get(key);

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `⚡️ Successfully connected to MongoDB database: '${NODE_ENV}'`
    );
  } catch (err) {
    console.error(err.message);

    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
