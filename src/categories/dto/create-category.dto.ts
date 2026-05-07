import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Please provide a title' })
  @IsString({ message: 'Title should be string' })
  title: string;

  @IsNotEmpty({ message: 'Please provide a description' })
  @IsString({ message: 'Description should be string' })
  description: string;

  addedBy: UserEntity;
}
