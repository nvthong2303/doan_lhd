/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from "@nestjs/mongoose";
import { User } from 'src/modules/users/user.model';
import { Model } from "mongoose";
import { EMAIL, KEY, PASSWORD } from 'src/config/config';
import { Logger } from '@nestjs/common';
import { Lesson } from '../lesson/lesson.model';
import { ResultExercise } from '../result/resultExercise.model';
import { ResultLesson } from '../result/resultLesson.model';
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

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

  async forgetPassWord(req, res) {
    try {
      // handle
      const user = await this.userModel.findOne({ email: req.body.email })

      if (user) {
        // handle 
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: EMAIL,
            pass: PASSWORD
          }
        });

        const newPassword = makePassword(5);
        console.log('newpw', newPassword)
        const _user = await this.userModel.findOneAndUpdate({ email: req.body.email }, {
          password: newPassword
        })

        const content = `
        <!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10%" height="10%" viewBox="0 0 512 512">
                                        <defs>
                                            <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
                                                <stop offset="0%" stop-color="#007B55"></stop>
                                                <stop offset="100%" stop-color="#00AB55"></stop>
                                            </linearGradient>
                                            <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
                                                <stop offset="0%" stop-color="#5BE584"></stop>
                                                <stop offset="100%" stop-color="#00AB55"></stop>
                                            </linearGradient>
                                            <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
                                                <stop offset="0%" stop-color="#5BE584"></stop>
                                                <stop offset="100%" stop-color="#00AB55"></stop>
                                            </linearGradient>
                                        </defs>
                                        <g fill="#00AB55" fill-rule="evenodd" stroke="none" stroke-width="1">
                                            <path fill="url(#BG1)"
                                                d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z">
                                            </path>
                                            <path fill="url(#BG2)"
                                                d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994">
                                            </path>
                                            <path fill="url(#BG3)"
                                                d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48">
                                            </path>
                                        </g>
                                    </svg>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1
                                                    style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                    You have
                                                    requested to reset your password</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                    Here is your new password, try to log back into the system and change it
                                                    back to make it easier for you to remember
                                                </p>
                                                <p
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                                    ${newPassword}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                <address>
                                <a style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;"
                                    href="mailto:hoangducsn00@gmail.com">@: hoangducsn00@gmail.com</a>.<br>
                            </address>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        
        </html>
        `;

        const mailOptions = {
          from: EMAIL,
          to: req.body.email,
          subject: 'DATN_LHD Reset password',
          html: content
        };

        try {
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              // do something useful
              return res.status(200).json({
                code: 200,
                data: {},
                message: 'Check your mail to get new Password',
              });
            }
          });
        } catch (error) {
          console.log('error send mail', error)
          return res.status(400).json({
            code: 400,
            message: 'Bad request',
          });
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

function makePassword(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}