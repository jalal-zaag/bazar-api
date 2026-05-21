import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderProductEntity } from './entities/order-product.entity';
import { ShippingAddressEntity } from './entities/shipping-address.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
    private readonly productService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    const shippingEntity = new ShippingAddressEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.user = currentUser;
    orderEntity.shippingAddress = shippingEntity;

    const orderTbl = await this.orderRepository.save(orderEntity);

    let opEntity: {
      order: OrderEntity;
      product: ProductEntity;
      quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;
      // const productId = createOrderDto.orderedProducts[i].id;
      const product = await this.productService.findOne(
        createOrderDto.orderedProducts[i].id,
      );
      const quantity = createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;
      opEntity.push({
        order,
        product,
        quantity,
        product_unit_price,
      });
    }

    const op = await this.orderProductRepository
      .createQueryBuilder()
      .insert()
      .into(OrderProductEntity)
      .values(opEntity)
      .execute();

    return await this.findOne(orderTbl.id);
  }

  async findAll() {
    return this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
