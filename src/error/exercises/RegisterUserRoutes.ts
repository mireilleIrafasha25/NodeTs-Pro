
import {SignIn,SignUp,Validateopt,ResetPassword,ForgotPassword,getAllusers,Logout,updateUser,deleteUser,findUserByName,test,findUserById } from "../../controller/UserController";
import {authenticateToken,authorize} from "../../middleware/authenthicateToken";
import {validate} from "../../middleware/validation.middleware";
import {signupSchema,verifyEmailSchema,
    loginSchema,forgotPasswordSchema,
    resetPasswordSchema
} from "../../schemas/auth.schemas"
import { updateUserSchema } from "../../schemas/userschema";
export const UserRouter=[
    {
        method:"post",
        route:"/signup",
        controller:SignUp,
        action:"SignUp",
        middlewares:[validate(signupSchema)]
    },
    {
        method:"post",
        route:"/login",
        controller:SignIn,
        action:"SignIn",
        middlewares:[validate(loginSchema)]
    },
       {
        method:"get",
        route:"/listAll",
        controller:getAllusers,
        action:"AllUsers",
        
    },
      {
   method:"get",
   route:"/findUserById/:id",
   controller:findUserById,
   action:"findUserById",
   middlewares: [authenticateToken, authorize("admin")]
    },
    {
   method:"post",
   route:"/ValidateUser",
   controller:Validateopt,
   middlewares:[validate(verifyEmailSchema)]
    },
    {
        method:"put",
        route:"/updateUser/:id",
        controller:updateUser,
        action:"updateUser",
        middlewares:[validate(updateUserSchema)]

    },
    {
        method:"delete",
        route:"/deleteUser/:id",
        controller:deleteUser,
        action:"deleteUser",
         middlewares: [authenticateToken, authorize("admin")]
    },
    {
        method:"post",
        route:"/forgotPassword",
        controller:ForgotPassword,
        middlewares:[validate(forgotPasswordSchema)],
        action:"ForgotPassword",
    },
    {
        method:"post",
        route:"/resetPassword/:token/:id",
        controller:ResetPassword,
        middlewares:[validate(resetPasswordSchema)],
        action:"ResetPassword",
    },
]