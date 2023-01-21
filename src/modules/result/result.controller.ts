/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VERSION } from 'src/config/config';
import { WordService } from './../word/word.service';

const path = require('path');

@Controller(`${VERSION}/result`)
export class ResultController {
  constructor(private readonly resultService: ResultService, private readonly wordService: WordService) { }

  // route      POST /api/v1/result/saveResult
  // desc       save result
  // return     message
  // token      required true
  @Post('saveResult')
  saveResult(@Req() req, @Res() res) {
    return this.resultService.saveResult(req, res);
  }

  // route      POST /api/v1/result/saveResult
  // desc       get result
  // return     result
  // token      required true
  @Post('getResult')
  getResult(@Req() req, @Res() res) {
    return this.resultService.getResult(req, res);
  }

  // route      POST /api/v1/result/test
  // desc       test save file
  // return     message
  // token      required false
  // not use
  @Post('test')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './file',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const filename = `${path.parse(file.originalname).name}-${uniqueSuffix}${path.extname(file.originalname)}`;
        callback(null, filename)
      }
    })
  }))
  handleResult(@Req() req, @Res() res) {
    return this.wordService.searchWord(req, res)
  }

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultService.create(createResultDto);
  }

  @Get()
  findAll() {
    return this.resultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultService.update(+id, updateResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultService.remove(+id);
  }
}
