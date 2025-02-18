import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async login(
    @Body() userData: { email: string; password?: string; googleId?: string },
    @Res() res: Response,
  ): Promise<void> {
    const token: string = await this.authService.login(userData);

    // Stocke le token dans un cookie HttpOnly
    res.cookie('token', token, {
      httpOnly: true, // Le cookie n'est pas accessible par JavaScript
      secure: process.env.NODE_ENV === 'production', // Utiliser `secure` en prod uniquement
      maxAge: 3600 * 1000, // 1 heure
      sameSite: 'strict', // Protection contre les attaques CSRF
    });

    res.status(200).json('connection réussie');
  }
}
