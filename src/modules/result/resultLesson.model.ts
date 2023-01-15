/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export const resultLessonSchema = new mongoose.Schema({
  lesson: { type: String, required: true },
  user: { type: String, required: true },
  listExerciseDone: [{ type: String, required: true }],
}, {
  timestamps: true
});

export interface ResultLesson extends Document {
  _id: string;
  lesson: string;
  user: string;
  listExerciseDone: string[];
}
