import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product should not be empty' })
  @IsNumber({}, { message: 'Product should be an number' })
  productId: number;

  @IsNotEmpty({ message: 'Rating should not be empty' })
  @IsNumber()
  rating: number;

  @IsNotEmpty({ message: 'comment should not be empty' })
  @IsString()
  comment: string;
}
