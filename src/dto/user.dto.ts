import { Role } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public googleId?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(16)
  public pseudo: string;
}

export class UpdateUserDto {
  @IsString()
  public password?: string;

  @IsString()
  public avatar?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(16)
  public pseudo?: string;

  @IsIn(Object.values(Role), {
    message: "Le rôle doit être 'admin', 'modo' ou 'user'",
  })
  public role?: string;
}
