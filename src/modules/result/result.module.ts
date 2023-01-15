/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { resultLessonSchema } from "./resultLesson.model";
import { resultExerciseSchema } from "./resultExercise.model";

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'ResultLesson', schema: resultLessonSchema },
    { name: 'ResultExercise', schema: resultExerciseSchema }
  ])],
  controllers: [ResultController],
  providers: [ResultService]
})
export class ResultModule {}
