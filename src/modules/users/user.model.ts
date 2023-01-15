/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    listLesson: [
        {type: String, require: true }
    ]
});

export interface User extends Document {
    _id: string;
    email: string;
    password: string;
    listLesson: string[];
}