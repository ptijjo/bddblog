import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { User } from 'src/interface/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<User[]> {
    const allUser: User[] | [] = await this.prisma.user.findMany();
    return allUser;
  }

  public async findOne(id: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    return user;
  }

  public async create(userData: CreateUserDto): Promise<User> {
    const existUser: User | null = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existUser) throw new UnauthorizedException('User already exist !');

    const existGoogleId: User | null = await this.prisma.user.findUnique({
      where: { googleId: userData.googleId },
    });

    if (existGoogleId) throw new UnauthorizedException('User already exist !');

    if (!userData.googleId && userData.password) {
      const hashPassword: string = await bcrypt.hash(
        userData.password as string,
        10,
      );
      const create = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashPassword,
        },
      });

      return create;
    }

    throw new UnauthorizedException("Veuillez choisir un type d'inscription");
  }

  public async update(userData: UpdateUserDto, userId: string): Promise<User> {
    const existUser: User | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existUser) throw new UnauthorizedException("User doesn't exist !");

    const updatedUserData: any = { ...userData };

    if (userData.role) {
      updatedUserData.role = userData.role as Role;
      if (updatedUserData.role !== 'admin') throw new UnauthorizedException();
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const update: User = await this.prisma.user.update({
      where: {
        id: existUser.id,
      },
      data: updatedUserData,
    });

    return update;
  }

  public async delete(id: string): Promise<User> {
    const existUser: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!existUser) throw new UnauthorizedException("User doesn't exist !");

    const deleteUser: User = await this.prisma.user.delete({
      where: { id: existUser.id },
    });

    return deleteUser;
  }
}
