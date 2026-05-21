import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'Phone can not be empty' })
  @IsString({ message: 'Phone format should be string' })
  phone: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Name can not be empty' })
  name: string;

  @IsNotEmpty({ message: 'address can not be empty' })
  @IsString({ message: 'address format should be string' })
  address: string;

  @IsNotEmpty({ message: 'city can not be empty' })
  @IsString({ message: 'city format should be string' })
  city: string;

  @IsNotEmpty({ message: 'postalCode can not be empty' })
  @IsString({ message: 'postalCode format should be string' })
  postalCode: string;

  @IsNotEmpty({ message: 'state can not be empty' })
  @IsString({ message: 'state format should be string' })
  state: string;

  @IsNotEmpty({ message: 'Country can not be empty' })
  @IsString({ message: 'Country format should be string' })
  country: string;
}
