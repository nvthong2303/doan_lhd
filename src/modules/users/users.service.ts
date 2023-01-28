/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from "@nestjs/mongoose";
import { User } from 'src/modules/users/user.model';
import { Model } from "mongoose";
import { KEY } from 'src/config/config';
import { Logger } from '@nestjs/common';
import { Lesson } from '../lesson/lesson.model';
import { ResultExercise } from '../result/resultExercise.model';
import { ResultLesson } from '../result/resultLesson.model';
const jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Lesson') private lessonModel: Model<Lesson>,
    @InjectModel('ResultExercise') private resultExerciseModel: Model<ResultExercise>,
    @InjectModel('ResultLesson') private resultLessonModel: Model<ResultLesson>,
  ) { }

  async register(req, res) {
    try {
      const user = await this.userModel.findOne({ email: req.body.email }).clone()

      if (user) {
        return res.status(409).json({
          code: 409,
          message: 'Email already exists',
        });
      } else {
        const newUser = new this.userModel(req.body);
        await newUser.save();

        const token = jwt.sign({ email: req.body.email }, KEY)

        return res.status(200).json({
          code: 200,
          token,
          message: 'Register success',
        });
      }
    } catch (error) {
      Logger.log('error register', error);
      return res.status(400).json({
        code: 400,
        message: 'Bad request',
      });
    }
  }

  async login(req, res) {
    try {
      if (req.body.email && req.body.password) {
        const email = req.body.email
        const password = req.body.password
        const user = await this.userModel.findOne({ email, password }).clone()

        if (!user) return res.status(401).json({
          code: 401,
          message: 'Invalid Email / Password',
        })

        const token = jwt.sign({ email }, KEY)

        return res.status(200).json({
          code: 200,
          token,
          message: 'Login success'
        })
      } else {
        return res.status(400).json({
          code: 400,
          message: 'Email / Password is required'
        });
      }
    } catch (error) {
      Logger.log('error login', error);
      return res.status(400).json({
        code: 400,
        message: 'Bad request'
      });
    }
  }

  async getInfo(req, res) {
    try {
      if (req.body.user.email) {
        const user = await this.userModel.findOne({ email: req.body.user.email })

        if (user) {
          user.password = '';
          return res.status(200).json({
            code: 200,
            user,
            message: 'Get info user success'
          })
        } else {
          return res.status(401).json({
            code: 401,
            message: 'Not found',
          })
        }
      } else {
        return res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    } catch (error) {
      Logger.log('error login', error);
      return res.status(400).json({
        code: 400,
        message: 'Bad request'
      });
    }
  }

  async addLesson(req, res) {
    try {
      // handle
      console.log(req.body)
      const user = await this.userModel.findOne({
        email: req.body.user.email
      })
      console.log(user)

      if (user) {
        if (!user.listLesson.includes(req.body.lessonId)) {
          await this.userModel.findOneAndUpdate({
            email: req.body.user.email
          }, {
            '$push': {
              'listLesson': req.body.lessonId
            }
          })

          return res.status(200).json({
            code: 200,
            message: 'Add success',
          });
        } else {
          return res.status(400).json({
            code: 400,
            message: 'Lesson exists',
          })
        }
      } else {
        return res.status(400).json({
          code: 400,
          message: 'User Notfound',
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

  async removeLesson(req, res) {
    try {
      // handle
      console.log(req.body)
      const user = await this.userModel.findOne({
        email: req.body.user.email
      })
      console.log(user)

      if (user) {
        if (user.listLesson.includes(req.body.lessonId)) {
          await this.userModel.findOneAndUpdate({
            email: req.body.user.email
          }, {
            '$pull': {
              'listLesson': req.body.lessonId
            }
          })

          return res.status(200).json({
            code: 200,
            message: 'Remove success',
          });
        } else {
          return res.status(400).json({
            code: 400,
            message: 'Lesson not exists',
          })
        }
      } else {
        return res.status(400).json({
          code: 400,
          message: 'User Notfound',
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

  async updateInfo(req, res) {
    try {
      const user = await this.userModel.findOne({
        email: req.body.user.email
      })
      if (user) {
        if (req.body.user.email !== req.body.email) {
          await this.lessonModel.updateMany({ author: req.body.user.email }, { author: req.body.email })

          await this.resultExerciseModel.updateMany({ user: req.body.user.email }, { user: req.body.email })

          await this.resultLessonModel.updateMany({ user: req.body.user.email }, { user: req.body.email })
        }
        await this.userModel.findOneAndUpdate({
          email: req.body.user.email
        }, {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        })
        const token = jwt.sign({ email: req.body.email }, KEY)
        return res.status(200).json({
          code: 200,
          token,
          message: 'Update info user success'
        })
      } else {
        return res.status(401).json({
          code: 401,
          message: 'Not found',
        })
      }
    } catch (error) {
      Logger.log('error update info', error);
      return res.status(400).json({
        code: 400,
        message: 'Bad request'
      });
    }
  }

  async updatePassWord(req, res) {
    try {
      const user = await this.userModel.findOne({ email: req.body.user.email })

      if (user) {
        if (user.password !== req.body.oldPassword) {
          return res.status(202).json({
            code: 202,
            message: 'Your password has been changed',
          })
        } else {
          await this.userModel.findOneAndUpdate({ email: req.body.user.email }, {
            password: req.body.newPassword
          })

          return res.status(200).json({
            code: 200,
            message: 'Change password success',
          })
        }

      } else {
        return res.status(401).json({
          code: 401,
          message: 'Not found',
        })
      }
    } catch (error) {
      Logger.log('error update password', error);
      return res.status(400).json({
        code: 400,
        message: 'Bad request'
      });
    }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}