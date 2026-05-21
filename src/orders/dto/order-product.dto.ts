import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderProductDto {
  @IsNotEmpty({ message: 'Product can not be empty' })
  id: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price should be number & max decimal precision 2' },
  )
  @IsPositive({ message: 'Price can not be positive integer' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Quantity should be number' })
  @IsPositive({ message: 'Quality can not be positive integer' })
  product_quantity: number;
}
