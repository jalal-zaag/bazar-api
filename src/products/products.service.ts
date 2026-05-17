import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  // constructor(
  //   @InjectRepository(CategoryEntity)
  //   private categoryRepository: Repository<CategoryEntity>,
  // ) {}

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    currentUser,
  ): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(
      +createProductDto.categoryId,
    );

    if (!category) throw new NotFoundException('Category not found');

    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({
      relations: ['category', 'addedBy'],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
          roles: true,
        },
        category: {
          id: true,
          title: true,
          description: true,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.productRepository.findOne({
      where: { id: id },
      relations: ['category', 'addedBy'],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
          roles: true,
        },
        category: {
          id: true,
          title: true,
          description: true,
        },
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
