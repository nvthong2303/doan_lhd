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
  constructor(private readonly lessonService: LessonService) { }

  // route      POST /api/v1/lesson/create
  // desc       tạo mới bài học
  // return     message
  // token      required true
  @Post(`create`)
  createNewLesson(@Req() req, @Res() res) {
    return this.lessonService.createNewLesson(req, res);
  }

  // route      POST /api/v1/lesson/addExercise
  // desc       thêm bài tập vào bài học
  // return     message
  // token      required true
  @Post(`exercise`)
  addWordToLesson(@Req() req, @Res() res) {
    return this.lessonService.addWordToLesson(req, res);
  }

  // route      POST /api/v1/lesson/listAuth
  // desc       danh sách bài học theo email
  // return     list lesson + result of exercise
  // token      required true
  @Get('listAuth')
  getListAuthLesson(@Req() req, @Res() res) {
    return this.lessonService.getListLessonAuth(req, res);
  }

  // route      POST /api/v1/lesson/detail
  // desc       chi tiết bài học theo id
  // return     list lesson + result of exercise
  // token      required false
  @Get('detail/:id')
  getDetailLesson(@Req() req, @Res() res, @Param('id') lessonId) {
    return this.lessonService.getDetailLesson(req, res, lessonId);
  }

  // route      POST /api/v1/lesson/listUnAuth
  // desc       danh sách bài học không theo email
  // return     list lesson + result of exercise
  // token      required true
  @Get('listOtherAuth')
  getListUnAuthLesson(@Req() req, @Res() res) {
    return this.lessonService.getListLessonUnAuth(req, res);
  }

  // route      POST /api/v1/lesson/list
  // desc       danh sách bài học mặc định
  // return     list lesson
  // token      required false
  @Get('list')
  getListLesson(@Req() req, @Res() res) {
    return this.lessonService.getListLesson(req, res);
  }

  // route      POST /api/v1/lesson/update
  // desc       danh sách bài học mặc định
  // return     list lesson
  // token      required false
  @Post('update')
  updateLesson(@Req() req, @Res() res) {
    return this.lessonService.updateLesson(req, res);
  }

  // route      POST /api/v1/lesson/searchAuth
  // desc       tìm kiếm bài học không theo email
  // return     list lesson
  // token      required false
  // @Post('searchAuthOtherLesson')
  // searchListAuthOtherLesson(@Req() req, @Res() res) {
  //   return this.lessonService.searchListAuthOtherLesson(req, res);
  // }

  // route      POST /api/v1/lesson/list
  // desc       tìm kiếm bài học mặc định
  // return     list lesson
  // token      required false
  @Post('search')
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
