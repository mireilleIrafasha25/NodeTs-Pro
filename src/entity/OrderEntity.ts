import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './userEntity';
import { Meal } from './mealEntity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  deliveryTime!: string; // e.g., "12:30 PM"

  @Column({ default: 'pending' })
  status!: 'pending' | 'preparing' | 'on_the_way' | 'delivered';

  @Column('decimal')
  totalPrice!: number;

  @Column({ nullable: true })
  deliveryPersonName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(()=>User,(user)=>user.id,{ onDelete: "CASCADE" })
  users!:User[];

  @ManyToOne(() => Meal)
  meal!: Meal;
}
