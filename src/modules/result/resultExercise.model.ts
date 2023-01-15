/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export const resultExerciseSchema = new mongoose.Schema({
  lesson: { type: String, required: true },
  exercise: { type: String, required: true },
  user: { type: String, required: true },
  result: [{
    type: Number,
    createdAt: Number,
    required: true
  }],
}, {
  timestamps: true
});

export interface ResultExercise extends Document {
  _id: string;
  lesson: string;
  exercise: string;
  user: string;
  result: object[]
}
