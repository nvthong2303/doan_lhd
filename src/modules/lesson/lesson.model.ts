/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  author: { type: String, required: true },
  exercise: [{ type: String }],
}, {
  timestamps: true
});

export interface Lesson extends Document {
  _id: string;
  title: string;
  description: string;
  author: string;
  exercise: string[];
}
