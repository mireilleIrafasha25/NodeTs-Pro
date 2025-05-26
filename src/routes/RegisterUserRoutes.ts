
import {SignIn,SignUp,Validateopt,ResetPassword,ForgotPassword,getAllusers,Logout,updateUser,deleteUser,findUserByName,test,findUserById } from "../repository/UserController";
import {authenticateToken,authorize} from "../middleware/authenthicateToken"
export const UserRouter=[
    {
        method:"post",
        route:"/signup",
        controller:SignUp,
        action:"SignUp"
    },
    {
        method:"post",
        route:"/login",
        controller:SignIn,
        action:"SignIn"
    },
       {
        method:"get",
        route:"/listAll",
        controller:getAllusers,
        action:"AllUsers"
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
   action:"FindUser"
    },
    {
        method:"put",
        route:"/updateUser/:id",
        controller:updateUser,
        action:"updateUser",
         middlewares: [authenticateToken], // all logged-in user can update

    },
    {
        method:"delete",
        route:"/deleteUser/:id",
        controller:deleteUser,
        action:"deleteUser",
         middlewares: [authenticateToken, authorize("admin")]
    }
]