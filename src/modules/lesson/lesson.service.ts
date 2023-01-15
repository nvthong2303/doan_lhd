/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from './lesson.model';

@Injectable()
export class LessonService {
  constructor(@InjectModel('Lesson') private lessonModel: Model<Lesson>) { }

  async createNewLesson(req, res) {
    try {
      const lesson = await this.lessonModel.findOne({ title: req.body.title }).clone()

      if (lesson) {
        return res.status(400).json({
          code: 409,
          message: 'Lesson already exists',
        });
      } else {
        const countLesson = await this.lessonModel.count();
        const newLesson = new this.lessonModel({
          title: req.body.title ?? `Lesson ${countLesson + 1}`,
          description: req.body.description,
          author: req.body.author,
          exercise: []
        });
        console.log(newLesson)

        await newLesson.save();

        return res.status(201).json({
          code: 201,
          message: 'Create success',
        });
      }
    } catch (error) {
      Logger.log('error create lesson', error);
      return res.status(409).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  async addWordToLesson(req, res) {
    try {
      // handle
      const lesson = await this.lessonModel.findOne({ title: req.body.title }).clone()

      if (!lesson) {
        return res.status(409).json({
          code: 409,
          message: 'Lesson not found',
        });
      } else if (lesson.exercise.includes(req.body.exerciseId)) {
        return res.status(409).json({
          code: 409,
          message: 'Exercise exists',
        });
      } else {
        const UpdatedLesson = await this.lessonModel.findOneAndUpdate({ title: req.body.title }, {
          "$push": {
            "exercise": req.body.exerciseId
          }
        })
      }

      return res.status(201).json({
        code: 201,
        message: 'Add new exercise success',
      });
    } catch (error) {
      Logger.log('error create lesson', error);
      return res.status(400).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  async getListLessonAuth(req, res) {
    try {
      const listLesson = await this.lessonModel
        .find({ author: req.body.user.email })
        .sort('createdAt')
        .skip(req.body.skip ?? 0)
        .limit(req.body.limit ?? 20)
        .exec();

      console.log(listLesson);

      return res.status(200).json({
        code: 201,
        data: listLesson,
        message: 'Get list success',
      });
    } catch (error) {
      Logger.log('error create lesson', error);
      return res.status(409).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  async getListLesson(req, res) {
    try {
      const listLesson = await this.lessonModel
        .find()
        .sort('createdAt')
        .skip(req.body.skip ?? 0)
        .limit(req.body.limit ?? 20)
        .exec();

      return res.status(200).json({
        code: 201,
        data: listLesson,
        message: 'Get list success',
      });
    } catch (error) {
      Logger.log('error create lesson', error);
      return res.status(409).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  async searchListLesson(req, res) {
    try {
      if (req.body.keyword) {
        const listLesson = await this.lessonModel
          .find({'$or':
              [
                {
                  title: { $regex: req.body.keyword }
                },
                {
                  description: { $regex: req.body.keyword }
                },
              ]
          })
          .sort('createdAt')
          .skip(req.body.skip ?? 0)
          .limit(req.body.limit ?? 20)
          .exec();

        return res.status(200).json({
          code: 200,
          data: listLesson,
          message: 'Get list success',
        });
      } else {
        return res.status(400).json({
          code: 400,
          message: 'Bad request',
        });
      }
    } catch (error) {
      Logger.log('error create lesson', error);
      return res.status(409).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }
  create(createLessonDto: CreateLessonDto) {
    return 'This action adds a new lesson';
  }

  findAll() {
    return `This action returns all lesson`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lesson`;
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} lesson`;
  }
}