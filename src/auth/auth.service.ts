import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/interface/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public async login(userData: {
    email: string;
    password?: string;
    googleId?: string;
  }): Promise<string> {
    if (
      (userData.email as string) &&
      (userData.password as string) &&
      !userData.googleId
    ) {
      const findUser: User | null = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!findUser) throw new UnauthorizedException('Identifiants incorrects');

      const comparePassword = await bcrypt.compare(
        userData.password as string,
        findUser.password as string,
      );
      if (!comparePassword)
        throw new UnauthorizedException('Identifiants incorrects');

      const updated: User = await this.prisma.user.update({
        where: { email: findUser.email },
        data: {
          lastConnection: new Date(),
        },
      });

      const payload = {
        id: updated.id,
        email: updated.email,
        pseudo: updated.pseudo,
        role: updated.role,
        avatar: updated.avatar,
      };

      return await this.jwtService.signAsync(payload);
    }
    throw new UnauthorizedException('Requête invalide');
  }
}
