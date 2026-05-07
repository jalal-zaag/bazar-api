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
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationGuard } from '../utility/guards/authentication.guard';
import { Roles } from '../utility/common/user-roles.enu';
import { AuthorizationGurad } from '../utility/guards/authorization.gurad';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthenticationGuard, AuthorizationGurad([Roles.ADMIN]))
  @Post('create')
  async create(
    @Body() categoryData: CreateCategoryDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.categoriesService.createCategories(
      categoryData,
      currentUser,
    );
  }

  @Get("all")
  async findAll() {
    return this.categoriesService.findALl();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
