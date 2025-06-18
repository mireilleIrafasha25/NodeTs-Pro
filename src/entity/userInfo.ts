// entities/UserInfo.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne,JoinColumn } from "typeorm";
import { User } from "./userEntity";
import { ActivityLevel } from "../utils/activityLevel";
@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("float")
  weight!: number;

  @Column("float")
  height!: number;

  @Column()
  gender!: string;

  @Column()
  age!: number;

  @Column()
  goal!: string; // 'lose', 'gain', 'maintain'

  @Column({ nullable: true })
  isPregnant?: boolean;

  @Column({ nullable: true })
  pregnancyTrimester?: number;

  @Column({ nullable: true })
  isBreastFeeding?: boolean;

  @Column({ nullable: true })
  haveBreastMilk?: boolean;

  @Column()
  typeOfJob!: string; // e.g., 'sedentary', 'active'

  @Column("simple-array", { nullable: true })
  allergies?: string[]; // e.g., ['milk', 'meat']

  @Column({ nullable: true })
  babyAgeInMonths?: number;

  @Column({ nullable: true })
  healthrelatedDisease?: boolean;

  @Column({ type: 'enum', enum: ActivityLevel })
 activityLevel!: ActivityLevel;

@Column("simple-array", { nullable: true })
dietPreferences?: string[]; // e.g., ['vegetarian', 'gluten-free']

@OneToOne(() => User, { onDelete: "CASCADE" })
@JoinColumn()
user!: User;

}
