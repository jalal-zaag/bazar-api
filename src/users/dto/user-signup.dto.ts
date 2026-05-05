import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserSignupDto {
  @IsNotEmpty({ message: 'Name can not be null' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  password: string;
}
