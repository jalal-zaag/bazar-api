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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationGuard } from '../utility/guards/authentication.guard';
import { Roles } from '../utility/common/user-roles.enu';
import { AuthorizationGurad } from '../utility/guards/authorization.gurad';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticationGuard, AuthorizationGurad([Roles.ADMIN]))
  @Post('create')
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get('get-all')
  async findAll() {
    return await this.reviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewsService.findOne(+id);
  }

  @Get('get-review-by-product-id/:productId')
  async findReviewByProductId(@Param('productId') productId: string) {
    return await this.reviewsService.findReviewByProductId(+productId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGurad([Roles.ADMIN]))
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.reviewsService.remove(+id);
  }
}
