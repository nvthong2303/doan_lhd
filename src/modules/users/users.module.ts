/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userSchema } from 'src/modules/users/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { lessonSchema } from '../lesson/lesson.model';
import { resultLessonSchema } from '../result/resultLesson.model';
import { resultExerciseSchema } from '../result/resultExercise.model';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: userSchema },
    { name: 'Lesson', schema: lessonSchema },
    { name: 'ResultLesson', schema: resultLessonSchema },
    { name: 'ResultExercise', schema: resultExerciseSchema },
  ])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
