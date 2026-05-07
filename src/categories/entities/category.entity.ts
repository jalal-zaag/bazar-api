import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export class Category {}

@Entity("categories")
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;


  @ManyToOne(() => UserEntity, (user) => user.categories)
  addedBy: UserEntity;
}