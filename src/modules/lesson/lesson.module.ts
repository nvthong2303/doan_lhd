/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { lessonSchema } from "./lesson.model";

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Lesson', schema: lessonSchema }])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
