
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Unique,OneToMany,OneToOne
} from 'typeorm';
import { Token } from './Token';
import {Blog} from "./blog";
import { UserInfo } from './userInfo';
import { Order } from './OrderEntity';
@Entity()
@Unique(['email']) 
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column()
  otp!: number;

  @Column({ type: 'timestamp', nullable: true })
  otpExpires!: Date;

  @Column({ default: false })
  verified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

 @OneToMany(() => Token, (token) => token.user, { cascade: true })
  tokens!: Token[];

  @OneToMany(() => Blog, (blog) => blog.users, { cascade: true })
  blogs!: Blog[];
  
@OneToOne(() => UserInfo, (userInfo) => userInfo.user, {cascade: true})
userInfo!: UserInfo;

@OneToMany(() => Order, (order) => order.users,{cascade:true})
orders!: Order[];

}
