/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from './lesson.model';
import { User } from "../users/user.model";
import { ResultLesson } from "../result/resultLesson.model";
import { Word } from "../Word/word.model";

@Injectable()
export class LessonService {
  constructor(
    @InjectModel('Lesson') private lessonModel: Model<Lesson>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('ResultLesson') private resultLessonModel: Model<ResultLesson>,
  ) { }

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
          title: req.body.title ?? `lesson ${countLesson + 1}`,
          description: req.body.description,
          author: req.body.user.email,
          exercise: req.body.exercise
        });

        await this.userModel.findOneAndUpdate({
          email: req.body.user.email
        }, {
          '$push': {
            "listLesson": newLesson._id.toString()
          }
        })

        await newLesson.save();

        return res.status(200).json({
          code: 200,
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
      const lesson = await this.lessonModel.findById(req.body.lessonId).clone()

      if (!lesson) {
        return res.status(409).json({
          code: 409,
          message: 'Lesson not found',
        });
      } else {
        await this.lessonModel.findByIdAndUpdate(req.body.lessonId, {
          "$push": {
            "exercise": { '$each': req.body.words }
          }
        })
      }

      return res.status(200).json({
        code: 200,
        message: 'Add exercises success',
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
      const user = await this.userModel.findOne({ email: req.body.user.email })

      if (user) {
        const listLessonRes = await Promise.all(user.listLesson.map(async el => {
          const lesson = await this.lessonModel.findById(el)
          const result = await this.resultLessonModel.findOne({
            lessonId: el,
            user: req.body.user.email
          })
          if (lesson) {
            return {
              ...JSON.parse(JSON.stringify(lesson)),
              done: result ? result.listExerciseDone.length : 0
            }
          }
        }))

        return res.status(200).json({
          code: 200,
          data: listLessonRes.filter(el => el),
          message: 'Get list success',
        });
      } else {
        return res.status(409).json({
          code: 400,
          message: 'Bad request',
        });
      }
    } catch (error) {
      Logger.log('error get list lesson auth :', error);
      return res.status(409).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  async getListLessonUnAuth(req, res) {
    try {
      const listLesson = await this.lessonModel
        .find({ author: { '$ne': req.body.user.email } })
        .sort('createdAt')
        .skip(req.body.skip ?? 0)
        .limit(req.body.limit ?? 20)
        .exec();

      return res.status(200).json({
        code: 200,
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
        code: 200,
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
          .find({
            '$or':
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

  async getDetailLesson(req, res, lessonId) {
    try {
      const lesson = await this.lessonModel.findById(lessonId)

      if (lesson) {
        return res.status(200).json({
          code: 200,
          data: lesson,
          message: 'Get detail lesson success',
        });
      }
    } catch (error) {
      Logger.log('error get detail lesson', error);
      return res.status(409).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  async updateLesson(req, res) {
    try {
      // handle
      const _lesson = await this.lessonModel.findById(req.body.lessonId)

      if (_lesson) {
        if (_lesson.author === req.body.user.email) {
          const lesson = await this.lessonModel.findByIdAndUpdate(req.body.lessonId, {
            title: req.body.title,
            description: req.body.description,
            author: req.body.user.email,
            exercise: req.body.exercise
          })

          return res.status(200).json({
            code: 200,
            data: lesson,
            message: 'Update success',
          });
        } else {
          return res.status(401).json({
            code: 401,
            message: 'Not permission',
          })
        }
      } else {
        return res.status(401).json({
          code: 401,
          message: 'Not found',
        })
      }
    } catch (error) {
      Logger.log('error message', error);
      return res.status(400).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  // async searchListAuthOtherLesson(req, res) {
  //   try {
  //     if (req.body.keyword) {
  //       const listLesson = await this.lessonModel
  //         .find({
  //           '$or':
  //             [
  //               {
  //                 title: { $regex: req.body.keyword }
  //               },
  //               {
  //                 description: { $regex: req.body.keyword }
  //               },
  //             ],
  //           '$ne': req.body.user.email
  //         })
  //         .sort('createdAt')
  //         .skip(req.body.skip ?? 0)
  //         .limit(req.body.limit ?? 20)
  //         .exec();

  //       return res.status(200).json({
  //         code: 200,
  //         data: listLesson,
  //         message: 'Get list success',
  //       });
  //     } else {
  //       return res.status(400).json({
  //         code: 400,
  //         message: 'Bad request',
  //       });
  //     }
  //   } catch (error) {
  //     Logger.log('error create lesson', error);
  //     return res.status(409).json({
  //       code: 400,
  //       message: 'Bad request',
  //     });
  //   }
  // }

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
