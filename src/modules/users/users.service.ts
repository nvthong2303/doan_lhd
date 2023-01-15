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
const jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) { }

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

        return res.status(201).json({
          code: 201,
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