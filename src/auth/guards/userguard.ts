import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Injectable()
export class UserAuthGuard extends AuthGuard(['jwt']) {
  constructor(private readonly jwtStrategy: JwtStrategy) {
    super([jwtStrategy]);
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(error, user) {
    if (error || !user) {
      throw error || new UnauthorizedException();
    }
    return user;
  }
}
