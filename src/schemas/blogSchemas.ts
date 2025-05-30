import {descriptionSchema,nameSchema} from "./common"
import {z} from "zod"

export const addBlogSchema=z.object({
    body:z.object({
        name:nameSchema,
        descriptionSchema:descriptionSchema,
    })
});


export type addBlogInput=z.infer<typeof addBlogSchema>;