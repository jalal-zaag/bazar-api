import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('order_products')
export class OrderProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  product_unit_price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.products)
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.products, {
    cascade: true,
  })
  product: ProductEntity;
}
