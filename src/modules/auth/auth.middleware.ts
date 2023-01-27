/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { KEY } from 'src/config/config';
import { User } from '../users/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

@Injectable()
export class Middleware implements NestMiddleware {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers && req.headers.hasOwnProperty('authorization')) {
      try {
        const token = req.headers.authorization.replace('Bearer ', '');

        const user = jwt.verify(token, KEY);
        console.log('mdware ==>', user)

        if (user) {
          const _user = await this.userModel.findOne({ email: user.email })
          if (_user) {
            req.body.user = {
              email: user.email
            };

            return next();
          } else {
            return res.status(401).json({
              code: 401,
              message: 'Email has been changed',
            });
          }
        } else {
          return res.status(401).json({
            code: 401,
            message: 'Unauthorized error',
          });
        }
      } catch (error) {
        return res.status(401).json({
          code: 401,
          errors: 'Authorized error',
        });
      }
    }

    return res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
  }
}
