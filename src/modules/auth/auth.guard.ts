/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const jwt = require('jsonwebtoken');

const key = 'ChiaKh0ATh@nhC0ng';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(req) {

    if (req.headers && req.headers.hasOwnProperty('authorization')) {
      try {
        const token = req.headers.authorization.replace('Bearer ', '');

        const hash = jwt.verify(token, key);

        if (hash) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }

    return false;

  }
}
