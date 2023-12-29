import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

/**
 * @description extracts information regarding the user such as userId (from within request.session) which then uses to fetch user object and stores in request.currentUser
 * @usage globally defined in @see UsersModule
 */
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = this.usersService.findOne(userId);
      request.currentUser = user;
    }
    return next.handle();
  }
}
