/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export const resultLessonSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  user: { type: String, required: true },
  listExerciseDone: { type: Array, default: [] },
}, {
  timestamps: true
});

export interface ResultLesson extends Document {
  _id: string;
  lessonId: string;
  user: string;
  listExerciseDone: string[];
}
