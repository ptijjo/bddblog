import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { User } from 'src/interface/user.interface';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { CookieGuard } from 'src/guards/cookie.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorateur/role.decorateur';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CookieGuard, RoleGuard)
  @Roles()
  @Get()
  async findAll(@Res() res: Response): Promise<void> {
    const allUser: User[] = await this.userService.findAll();

    res.status(200).json(allUser);
  }

  @UseGuards(CookieGuard, RoleGuard)
  @Roles()
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const user: User = await this.userService.findOne(id);
    res.status(200).json(user);
  }

  @Post()
  async create(
    @Body() userData: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const create: User = await this.userService.create(userData);

    res.status(201).json(create);
  }

  @UseGuards(CookieGuard, RoleGuard)
  @Roles()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() userData: UpdateUserDto,
  ): Promise<void> {
    const update: User = await this.userService.update(userData, id);
    res.status(200).json(update);
  }

  @UseGuards(CookieGuard, RoleGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const deleteUser: User = await this.userService.delete(id);

    res.status(200).json(deleteUser);
  }
}
