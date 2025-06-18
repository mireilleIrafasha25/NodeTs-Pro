import { Entity,Column,PrimaryGeneratedColumn,CreateDateColumn } from "typeorm";

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column("decimal")
  price!: number;

  @Column()
  photo!: string; // URL or path to meal image

  @Column("simple-array")
  ingredients!: string[];

  @Column()
  preparationTime!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
