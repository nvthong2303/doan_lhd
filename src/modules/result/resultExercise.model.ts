/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export const resultExerciseSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  word: { type: String, required: true },
  user: { type: String, required: true },
  result: { type: Array, default: [] },
}, {
  timestamps: true
});

export interface ResultExercise extends Document {
  _id: string;
  lessonId: string;
  word: string;
  user: string;
  result: object[]
}
