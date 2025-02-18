import { JwtPayload } from 'src/guards/cookie.guard';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
