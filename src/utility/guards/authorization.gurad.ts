import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean  {
    const allowedRoles = this.reflector.get<string[]>('allowedRoles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const result = request?.currentUser?.roles?.map((role) => allowedRoles.includes(role)).find((val: boolean) => val === true);
    if(result) return  true;
    throw new UnauthorizedException("Sorry, you are not authorized");
  }
}