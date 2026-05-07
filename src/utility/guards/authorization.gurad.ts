import {
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';

// @Injectable()
// export class AuthorizationGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   canActivate(
//     context: ExecutionContext,
//   ): boolean  {
//     const allowedRoles = this.reflector.get<string[]>('allowedRoles', context.getHandler());
//     const request = context.switchToHttp().getRequest();
//     const result = request?.currentUser?.roles?.map((role) => allowedRoles.includes(role)).find((val: boolean) => val === true);
//     if(result) return  true;
//     throw new UnauthorizedException("Sorry, you are not authorized");
//   }
// }

export const AuthorizationGurad = (allowedRoles: string[]) => {
  class RolesGuardMixn implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const result = request?.currentUser?.roles
        ?.map((role) => allowedRoles.includes(role))
        .find((val: boolean) => val === true);
      console.log('result:', result);
      if (result) return true;
      throw new UnauthorizedException('Sorry, you are not authorized');
    }
  }

  const guards = mixin(RolesGuardMixn);
  return guards;
};
