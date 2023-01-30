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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { VERSION } from 'src/config/config';

@Controller(`${VERSION}/users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // route      POST /api/v1/users/register
  // desc       register user
  // return     message
  // token      required false
  @Post(`register`)
  register(@Req() req, @Res() res) {
    return this.usersService.register(req, res);
  }

  // route      POST /api/v1/users/login
  // desc       login user
  // return     token
  // token      required false
  @Post(`login`)
  login(@Req() req, @Res() res) {
    return this.usersService.login(req, res);
  }

  // route      POST /api/v1/users/info
  // desc       get info user
  // return     info user
  // token      required true
  @Get(`info`)
  getInfo(@Req() req, @Res() res) {
    return this.usersService.getInfo(req, res);
  }

  // route      POST /api/v1/users/addLesson
  // desc       add lesson to user
  // return     message
  // token      required true
  @Post(`addLesson`)
  addLesson(@Req() req, @Res() res) {
    return this.usersService.addLesson(req, res);
  }

  // route      POST /api/v1/users/removeLesson
  // desc       remove lesson to user
  // return     message
  // token      required true
  @Post(`removeLesson`)
  removeLesson(@Req() req, @Res() res) {
    return this.usersService.removeLesson(req, res);
  }

  // route      POST /api/v1/users/update
  // desc       update info user
  // return     message
  // token      required true
  @Post(`update`)
  updateInfo(@Req() req, @Res() res) {
    return this.usersService.updateInfo(req, res);
  }

  // route      POST /api/v1/users/updatePassword
  // desc       update password
  // return     message
  // token      required true
  @Post(`updatePassword`)
  updatePassword(@Req() req, @Res() res) {
    return this.usersService.updatePassWord(req, res);
  }

  // route      POST /api/v1/users/updatePassword
  // desc       update password
  // return     message
  // token      required true
  @Post(`forgetPassword`)
  forgetPassword(@Req() req, @Res() res) {
    return this.usersService.forgetPassWord(req, res);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
