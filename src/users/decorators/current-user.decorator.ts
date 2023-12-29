import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * @description gets the current logged in user from the
 * request context which is stored by the CurrentUserInterceptor
 * in the request object
 * @see CurrentUserInterceptor
 * @returns user User entity
 */
export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
