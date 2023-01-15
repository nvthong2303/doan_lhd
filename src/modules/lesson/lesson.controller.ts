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
  Put, UseGuards
} from "@nestjs/common";
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { VERSION } from '../../config/config';

@Controller(`${VERSION}/lesson`)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  // route      POST /api/v1/lesson/create
  // desc       create new lesson
  // return     message
  // token      required true
  @Post(`create`)
  createNewLesson(@Req() req, @Res() res) {
    return this.lessonService.createNewLesson(req, res);
  }

  // route      POST /api/v1/lesson/addExercise
  // desc       add exercise (word) to lesson
  // return     message
  // token      required true
  @Put(`exercise`)
  addWordToLesson(@Req() req, @Res() res) {
    return this.lessonService.addWordToLesson(req, res);
  }

  // route      POST /api/v1/lesson/listAuth
  // desc       get list lesson with result
  // return     list lesson + result of exercise
  // token      required true
  @Get('listAuth')
  getListAuthLesson(@Req() req, @Res() res) {
    return this.lessonService.getListLessonAuth(req, res);
  }

  // route      POST /api/v1/lesson/list
  // desc       get list lesson
  // return     list lesson
  // token      required false
  @Get('list')
  getListLesson(@Req() req, @Res() res) {
    return this.lessonService.getListLesson(req, res);
  }

  // route      POST /api/v1/lesson/list
  // desc       get list lesson
  // return     list lesson
  // token      required false
  @Get('search')
  searchListLesson(@Req() req, @Res() res) {
    return this.lessonService.searchListLesson(req, res);
  }

  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto);
  }

  @Get()
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(+id, updateLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
}
