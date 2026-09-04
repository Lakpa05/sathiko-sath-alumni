import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  image: String,
  date: Date,
  time: String,
  venue: String,
  description: String,
  registrationRequired: { type: Boolean, default: false },
  registrationDeadline: Date,
  status: { type: String, enum: ['draft','published'], default: 'published' }
}, { timestamps: true });
export default mongoose.model('Event', schema);
