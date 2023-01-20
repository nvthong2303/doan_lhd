/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    listLesson: [
        { type: String }
    ]
});

export interface User extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    listLesson: string[];
}