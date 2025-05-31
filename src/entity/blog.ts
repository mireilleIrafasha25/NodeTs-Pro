import {
Entity,
Column,
PrimaryGeneratedColumn,
ManyToOne,
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

    @ManyToOne(()=>User,(user)=>user.id,{ onDelete: "CASCADE" })
    users!:User[];
}