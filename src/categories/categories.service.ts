import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    // return await this.categoryRepository.findOneBy({ id });
    const category = await this.categoryRepository.findOne({
      where: { id: id },
      relations: { addedBy: true },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
