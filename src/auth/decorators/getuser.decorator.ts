import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Create a custom decorator to extract the authenticated user from the request
export const GetUser = createParamDecorator(
  // Function that defines the behavior of the decorator
  (data: string | undefined, context: ExecutionContext) => {
    // Extract the HTTP request object from the context
    const request = context.switchToHttp().getRequest();

    // If additional data is specified, return the corresponding property from the user object
    if (data) {
      return request.user[data];
    }

    // If no specific data is requested, return the entire user object
    return request.user;
  },
);
