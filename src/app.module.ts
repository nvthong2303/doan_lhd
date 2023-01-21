/* eslint-disable prettier/prettier */
import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { WordModule } from './modules/Word/Word.module';
import { ResultModule } from './modules/result/result.module';
import { Middleware } from './modules/auth/auth.middleware';
import { URL_MONGODB } from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonModule } from './modules/lesson/lesson.module';

@Module({
  imports: [
    MongooseModule.forRoot(URL_MONGODB),
    UsersModule,
    WordModule,
    ResultModule,
    LessonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes(
      { path: `/api/v1/lesson/listAuth`, method: RequestMethod.GET },
      { path: `/api/v1/lesson/create`, method: RequestMethod.POST },
      { path: `/api/v1/lesson/exercise`, method: RequestMethod.POST },
      { path: `/api/v1/lesson/listOtherAuth`, method: RequestMethod.GET },
      { path: `/api/v1/users/info`, method: RequestMethod.GET },
      { path: `/api/v1/users/addLesson`, method: RequestMethod.POST },
      { path: `/api/v1/result/saveResult`, method: RequestMethod.POST },
      // { path: `/user/login`, method: RequestMethod.POST },
    );
  }
}
