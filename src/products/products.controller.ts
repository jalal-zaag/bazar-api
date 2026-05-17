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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from '../utility/guards/authentication.guard';
import { AuthorizationGurad } from '../utility/guards/authorization.gurad';
import { Roles } from '../utility/common/user-roles.enu';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard, AuthorizationGurad([Roles.ADMIN]))
  @Post('create')
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, currentUser);
  }

  @Get('get-all')
  findAll() {
    return this.productsService.findAll();
  }

  @Get('get-by-id/:id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGurad([Roles.ADMIN]))
  @Patch('update/:id')
  async update(@Param('id')id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() currentUser: UserEntity) {
    return await this.productsService.update(+id, updateProductDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
