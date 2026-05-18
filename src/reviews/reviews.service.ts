import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productService: ProductsService,
  ) {}

  async findOneByProductIdAndUserid(productId: number, userId: number) {
    const review = await this.reviewRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        product: {
          id: productId,
        },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });

    return review;
  }

  async create(createReviewDto: CreateReviewDto, currentUser) {
    const product = await this.productService.findOne(
      +createReviewDto.productId,
    );

    let review = await this.findOneByProductIdAndUserid(
      createReviewDto.productId,
      currentUser.id,
    );

    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      review.comment = createReviewDto.comment;
      review.rating = createReviewDto.rating;
    }

    return await this.reviewRepository.save(review);
  }

  async findAll() {
    return await this.reviewRepository.find();
  }

  async findOne(id: number) {
    return await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }

  async findReviewByProductId(id: number) {
    return await this.reviewRepository.findOne({
      where: {
        product: {
          id,
        },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
