import {
Entity,
Column,
PrimaryGeneratedColumn,
OneToMany,
CreateDateColumn,
UpdateDateColumn,
Unique,
} from "typeorm"
import {User} from "./userEntity";
@Entity()
@Unique(['name'])
export class Blog{
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column()
    name!:string;

    @Column()
    description!:string;
    
    @Column()
    image!:string;

    @CreateDateColumn()
    date!:Date;

    @UpdateDateColumn()
    updatedAt!:Date;

    @OneToMany(()=>User,(user)=>user.id,{cascade:true})
    users!:User[];
}