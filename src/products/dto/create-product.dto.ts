import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title can not be empty' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Title can not be empty' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Price can not be empty' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price should be number & max decimal precision 2' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsNotEmpty({ message: 'Stock can not be empty' })
  @IsNotEmpty()
  @Min(0, { message: 'stock can not be negative' })
  stock: number;

  @IsNotEmpty({ message: 'Image can not be empty' })
  @IsArray({ message: 'images should be in array format' })
  images: string[];

  @IsNotEmpty({ message: 'category can not be empty' })
  @IsNumber({}, { message: 'category id should be a  number' })
  categoryId: number;
}
