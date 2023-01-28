/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Req,
  Res
} from "@nestjs/common";
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { VERSION } from 'src/config/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as process from "process";
import { createReadStream } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
let _fileName = '';

@Controller(`${VERSION}/word`)
export class WordController {
  constructor(private readonly WordService: WordService) { }

  @Post('search')
  searchWord(@Req() req, @Res() res) {
    return this.WordService.search(req, res);
  }

  // route      POST /api/v1/word/create
  // desc       create new word
  // return     message
  // token      required true
  // not use
  @Post('create')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './file',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const filename = `${path.parse(file.originalname).name}-${uniqueSuffix}${path.extname(file.originalname)}`;
        _fileName = filename;
        console.log(path.parse(file.originalname).name);
        callback(null, filename)
      }
    })
  }))
  create(@UploadedFile() file: Express.Multer.File, req, res) {
    return this.WordService.createWord(file, req, res, _fileName);
  }

  // route      POST /api/v1/word/detail/:id
  // desc       chi tiết từ theo id
  // return     list lesson + result of exercise
  // token      required false
  @Get('detail/:word')
  getDetailWord(@Req() req, @Res() res, @Param('word') wordId) {
    return this.WordService.getDetailWord(req, res, wordId);
  }

  // route      POST /api/v1/word/detail/:id
  // desc       chi tiết từ theo id
  // return     list lesson + result of exercise
  // token      required false
  @Post('list')
  getListWord(@Req() req, @Res() res) {
    return this.WordService.getListWord(req, res);
  }

  // route      GET /api/v1/word/file
  // desc       get file word.mp3
  // return     file
  // token      required false
  // not use
  @Get('file')
  getWordFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), './file/xuan hat.mp3'))
    return new StreamableFile(file);
  }

  @Get()
  findAll() {
    return this.WordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.WordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
    return this.WordService.update(+id, updateWordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.WordService.remove(+id);
  }
}
