import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  name: string;
  title: string;
  content: string;
  category: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
      maxlength: [2000, 'Content cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['general', 'tech', 'business', 'lifestyle', 'other'],
      default: 'general',
    },
    userId: {
      type: String,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);