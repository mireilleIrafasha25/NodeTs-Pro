import {z} from "zod"

export const emailSchema=z.string().email("Email Format is not valid").max(100,"Email must be less than 100 characters");
const passwordSchema=z.string()
.min(8,'password must be atleast 8 characters')
.max(100,"Password must be less than 100 characters")
.regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/);


export const isParamSchema=z.object(
    {
     id:z.string()   
    }
)
