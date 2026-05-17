import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { UserEntity } from '../users/entities/user.entity';

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
    const product = await this.productRepository.findOne({
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

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity,
  ) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);

    product.addedBy = currentUser;

    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );

      product.category = category;
    }

    return await this.productRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
