import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { AuthenticationGuard } from '../utility/guards/authentication.guard';
import { AuthorizeRolesDecorator } from '../utility/decorators/authorize-roles.decorator';
import { Roles } from '../utility/common/user-roles.enu';
import { AuthorizationGuard } from '../utility/guards/authorization.gurad';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() body: UserSignupDto): Promise<UserEntity> {
    return await this.usersService.signUp(body);
  }

  @Post('signin')
  async signIn(@Body() userSignInDto: UserSignInDto) {
    const user = await this.usersService.signIn(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);
    return { accessToken, user };
  }

  @AuthorizeRolesDecorator(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // return this.usersService.create(createUserDto);
    return 'hi';
  }

  @Get('single/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }
}
