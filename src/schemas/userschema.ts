
import {z} from "zod";
import{emailSchema,isParamSchema} from "./common"
import { email } from "zod/v4";
export const  createUserSchema=z.object({
    body:z.object({
        email:emailSchema,
        role:z.enum(['user',"admin"]).default('user')
    })
})

export const updateUserSchema=z.object({
    params:isParamSchema,
    body:z.object({
     email:emailSchema.isOptional(),
     role:z.enum(['user',"admin"]).default('user'),
     isActive:z.boolean().optional(),
    })
})
.refine((data)=>
    Object.keys(data).length>0,
{
    message:"At least one field must be peovided for update"
});

export type CreateUserInput=z.infer<typeof createUserSchema>
export type updateUserInput=z.infer<typeof updateUserSchema>