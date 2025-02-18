import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CookieMiddleware } from './middleware/cookie.middleware';
import { RoleGuard } from './guards/role.guard';
import { CookieGuard } from './guards/cookie.guard';
import { PostModule } from './post/post.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UserModule, AuthModule, PostModule],
  controllers: [AppController],
  providers: [AppService, RoleGuard, CookieGuard],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieMiddleware).forRoutes('*');
  }
}
