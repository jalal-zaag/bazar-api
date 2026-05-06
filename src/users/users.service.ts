import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import { compare, hash } from 'bcrypt';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { sign } from 'jsonwebtoken';

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

  // async signIn(userSignInDto: UserSignInDto) {
  //   const userExist = await this.findSignUpByEmail(userSignInDto.email);
  //   if (!userExist) throw new BadRequestException('User does not exist');
  //   return userExist;
  // }

  async accessToken(user: UserEntity): Promise<string> {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY!,
      { expiresIn: process.env.ACCESS_TOKEN_SECRET_TIME as any },
    );
  }

  async signIn(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExist = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: userSignInDto.email })
      .getOne();
    if (!userExist) throw new BadRequestException('user does not exist');
    const matchPassword = await compare(
      userSignInDto.password,
      userExist.password,
    );
    if (!matchPassword) throw new BadRequestException('user does not match');
    delete userExist.password;
    return userExist;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
