import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK='snack'
}

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
  photo!: string;

  @Column("simple-array")
  ingredients!: string[];

  @Column()
  preparationTime!: string;

  @Column({
    type: 'enum',
    enum: MealType
  })
  mealType!: MealType;

  @CreateDateColumn()
  createdAt!: Date;
}
