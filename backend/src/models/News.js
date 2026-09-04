import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  image: String,
  content: String,
  author: String,
  category: String,
  status: { type: String, enum: ['draft','published'], default: 'published' }
}, { timestamps: true });
export default mongoose.model('News', schema);
