/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { wordSchema } from './Word.model';
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Word', schema: wordSchema }]),
    MulterModule.register({ dest: './file' })
  ],
  controllers: [WordController],
  providers: [WordService],
  exports: [WordService]
})
export class WordModule { }
