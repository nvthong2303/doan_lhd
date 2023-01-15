/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const wordSchema = new mongoose.Schema({
    word: { type: String, required: true },
    gp_audio_url: { type: String, required: false },
    us_audio_url: { type: String, required: false },
    meaning: { type: String, required: false },
    ipa: { type: String, required: true },
    index: { type: Number, required: true }
}, {
    timestamps: true
});

export interface Word extends Document {
    _id: string;
    word: string;
    gp_audio_url: string;
    us_audio_url: string;
    meaning: string;
    ipa: string;
    index: number;
}
