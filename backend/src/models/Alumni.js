import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: String,
  photo: String,
  batch: String,
  profession: String,
  organization: String,
  city: String,
  country: String,
  bio: String,
  socialLinks: { facebook: String, linkedin: String, instagram: String },
  privacy: { showEmail: {type:Boolean,default:false}, showPhone: {type:Boolean,default:false}, showLocation: {type:Boolean,default:true} },
  status: { type: String, enum: ['pending','approved','rejected','inactive'], default: 'pending' }
}, { timestamps: true });
export default mongoose.model('Alumni', schema);
