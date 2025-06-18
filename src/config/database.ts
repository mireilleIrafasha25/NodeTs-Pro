import { DataSource } from "typeorm";
import { User } from "../entity/userEntity";
import { Token } from "../entity/Token";
import {Blog} from "../entity/blog";
import { UserInfo } from "../entity/userInfo";
import * as dotenv from "dotenv";
dotenv.config();
export const AppDataSource=new DataSource(
{
type:"postgres",
host:"localhost",
 port: 5432,
 username: "postgres",
 password: "Mireille123@#",
 database: "User_db",
 synchronize: true,
 logging: ["error"],
 entities: [User,Token,Blog,UserInfo],
 migrations: [],
 subscribers: [],
})

export const InitializeDatabase = async():Promise<void>=>
{
    try{
        await AppDataSource.initialize()
        console.log("Database Connected Successfully")
    }
    catch(error)
    {
        console.error("Error connecting to database",error)
        throw error;
    }
}


