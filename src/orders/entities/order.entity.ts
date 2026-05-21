import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { ShippingAddressEntity } from './shipping-address.entity';
import { OrderProductEntity } from './order-product.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PROCESSING,
  })
  status: string;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.orderUpdatedBy)
  updatedBy: UserEntity;

  @OneToOne(
    () => ShippingAddressEntity,
    (shippingAddress) => shippingAddress.order,
    { cascade: true },
  )
  @JoinColumn()
  shippingAddress: ShippingAddressEntity;

  @OneToMany(
    () => OrderProductEntity,
    (orderProductEntity) => orderProductEntity.order,
    { cascade: true },
  )
  products: OrderProductEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;
}
