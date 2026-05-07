import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategories(
    categoryData: CreateCategoryDto,
    currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    categoryData.addedBy = currentUser;
    const category = await this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(category);
  }

  findALl() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
