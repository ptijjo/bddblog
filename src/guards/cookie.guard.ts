import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface JwtPayload {
  id: string;
  email: string;
  role: string | string[];
}

@Injectable()
export class CookieGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.cookies['token'];

    if (!token) throw new UnauthorizedException('token manquant');

    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.jwtSecret as string,
      });

      request.user = decoded;
    } catch (error) {
      throw new UnauthorizedException('token invalide ou expiré');
    }

    return true;
  }
}
