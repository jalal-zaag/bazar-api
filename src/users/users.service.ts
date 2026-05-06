import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import { hash } from 'bcrypt';
import { UserSignInDto } from './dto/user-sign-in.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findSignUpByEmail(email: string) {
    const userEmail = await this.usersRepository.findOneBy({ email });
    return userEmail;
  }

  async signUp(userSignUpDto: UserSignupDto): Promise<UserEntity> {
    const userExist = await this.findSignUpByEmail(userSignUpDto.email);

    if (userExist) throw new BadRequestException('email already exists');

    userSignUpDto.password = await hash(userSignUpDto.password, 10);

    let user = this.usersRepository.create(userSignUpDto);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async signIn(userSignInDto: UserSignInDto) {
    const userExist = await this.findSignUpByEmail(userSignInDto.email);
    if (!userExist) throw new BadRequestException('User does not exist');
    return userExist;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
