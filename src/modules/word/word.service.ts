/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Word } from './word.model';

@Injectable()
export class WordService {
  constructor(@InjectModel('Word') private WordModel: Model<Word>) { }

  // req body: { word, skip, limit }
  async search(req, res) {
    const listWord = await this.WordModel.find({
      word: { $regex: req.body.keyword ?? '' }
    }).sort('createdAt').skip(req.body.skip ?? 0).limit(req.body.limit ?? 20).exec();

    return res.status(200).json({
      code: 200,
      data: listWord,
    })
  }

  // not use
  createWord(file, req, res, filename) {
    return 'This action adds a new Word';
  }

  create(createWord: CreateWordDto) {
    return 'This action adds a new Word';
  }

  findAll() {
    return `This action returns all Word`;
  }

  findOne(id: number) {
    return `This action returns a #${id} Word`;
  }

  update(id: number, updateWordDto: UpdateWordDto) {
    return `This action updates a #${id} Word`;
  }

  remove(id: number) {
    return `This action removes a #${id} Word`;
  }
}
