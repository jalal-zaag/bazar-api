import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { isArray } from 'node:util';
import { verify } from 'jsonwebtoken';
import { UsersService } from '../../users/users.service';
import { UserEntity } from '../../users/entities/user.entity';

interface RequestWithCurrentUser extends Request {
  currentUser?: UserEntity;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: RequestWithCurrentUser, res: Response, next: NextFunction) {
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = undefined;
      next();
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const { id } = verify(
          token,
          process.env.ACCESS_TOKEN_SECRET_KEY!,
        ) as unknown as JwtPayload;
        const user = await this.usersService.findOne(+id);
        req.currentUser = user;
      } catch (e) {
        // invalid/malformed token — treat as unauthenticated
      }
      next();
    }
  }
}

interface JwtPayload {
  id: string;
}
