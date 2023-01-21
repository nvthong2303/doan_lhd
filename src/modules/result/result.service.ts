/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResultExercise } from './resultExercise.model';
import { ResultLesson } from './resultLesson.model';
import { Word } from '../word/word.model';
import { User } from '../users/user.model';

@Injectable()
export class ResultService {
  constructor(
    @InjectModel('ResultExercise') private resultExerciseModel: Model<ResultExercise>,
    @InjectModel('ResultLesson') private resultLessonModel: Model<ResultLesson>,
    @InjectModel('User') private userModel: Model<User>,
  ) { }

  async saveResult(req, res) {
    try {
      const resultExercise = await this.resultExerciseModel.findOneAndUpdate({
        lessonId: req.body.lessonId,
        word: req.body.word,
        user: req.body.user.email
      }, {
        lessonId: req.body.lessonId,
        word: req.body.word,
        user: req.body.user.email,
        '$push': {
          "result": {
            point: req.body.result,
            createAt: Date.now()
          }
        }
      }, {
        upsert: true
      })

      const resultLesson = await this.resultLessonModel.findOne({
        lessonId: req.body.lessonId,
        user: req.body.user.email
      })


      if (resultLesson) {
        if (resultLesson.listExerciseDone.includes(req.body.word)) {
          return res.status(200).json({
            code: 200,
            message: 'Save result'
          })
        } else {
          await this.resultLessonModel.findOneAndUpdate({
            lessonId: req.body.lessonId,
            user: req.body.user.email
          }, {
            '$push': {
              'listExerciseDone': req.body.word
            }
          })
        }
      } else {
        const newResultLesson = new this.resultLessonModel({
          lessonId: req.body.lessonId,
          user: req.body.user.email,
          listExerciseDone: [req.body.word]
        })

        await newResultLesson.save()
      }

      return res.status(200).json({
        code: 200,
        message: 'Save result'
      })
    } catch (error) {
      Logger.log('error create lesson', error);
      return res.status(409).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  async getResult(req, res) {
    try {
      // handle
      console.log(req.body)
      const result = await this.resultExerciseModel.findOne({
        lessonId: req.body.lessonId,
        word: req.body.word,
        user: req.body.user.email
      })

      return res.status(200).json({
        code: 200,
        data: result,
        message: 'Get result success',
      });
    } catch (error) {
      Logger.log('error message', error);
      return res.status(400).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  create(createResultDto: CreateResultDto) {
    return 'This action adds a new result';
  }

  findAll() {
    return `This action returns all result`;
  }

  findOne(id: number) {
    return `This action returns a #${id} result`;
  }

  update(id: number, updateResultDto: UpdateResultDto) {
    return `This action updates a #${id} result`;
  }

  remove(id: number) {
    return `This action removes a #${id} result`;
  }
}
