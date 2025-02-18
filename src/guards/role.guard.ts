import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from './cookie.guard';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: readonly string[] =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];

    if (requiredRoles.length === 0) return true;
    const request = context.switchToHttp().getRequest<Request>();

    const user: JwtPayload | undefined = request.user;

    if (!user) throw new ForbiddenException('Utilisateur non authetifié');

    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    console.log('User Roles:', userRoles);

    const hasRole = requiredRoles.some((role) => {
      console.log('Role autorisé : ', role);
      return userRoles.includes(role);
    });

    if (!hasRole) throw new ForbiddenException('Accès interdit');
    return true;
  }
}
