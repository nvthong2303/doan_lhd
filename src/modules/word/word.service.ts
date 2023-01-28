/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
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
    const word = await this.WordModel.findOne({
      word: req.body.keyword
    })
    const listWord = await this.WordModel.find({
      word: { $regex: req.body.keyword ?? '' }
    }).sort('createdAt').skip(req.body.skip ?? 0).limit(req.body.limit ?? 20).exec();

    if (word && listWord) {
      const filterListWord = listWord.filter(el => el.word !== word.word)
      return res.status(200).json({
        code: 200,
        data: [word, ...filterListWord],
      })
    } else {
      return res.status(200).json({
        code: 200,
        data: listWord,
      })
    }
  }

  async getDetailWord(req, res, id) {
    try {
      // id là word cần lấy
      const word = await this.WordModel.findOne({ word: id })

      if (word) {
        return res.status(200).json({
          code: 200,
          data: word,
          message: 'Get detail word success',
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

  async searchWord(req, res) {
    const _word = await this.WordModel.findOne({
      word: req.body.word
    })
    return res.status(200).json({
      code: 200,
      data: {
        ipa: _word.ipa ?? 'n æ ɹ oʊ z',
      },
      message: 'Validate success',
    });
  }

  async getListWord(req, res) {
    try {
      // id là word cần lấy
      console.log(req.body)
      const listWord = await this.WordModel.find({
        word: {
          '$in': req.body.list
        }
      })

      return res.status(200).json({
        code: 200,
        data: listWord,
        message: 'Get list word success',
      });
    } catch (error) {
      Logger.log('error get list lesson', error);
      return res.status(409).json({
        code: 400,
        message: 'Bad request',
      });
    }
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
