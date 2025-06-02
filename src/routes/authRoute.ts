import express, { Router } from 'express';
import { 
  SignIn,SignUp,Validateopt,ForgotPassword,ResetPassword,
  getAllusers ,test,updateUser,deleteUser,findUserById} from '../controller/UserController';
import { validate } from '../middleware/validation.middleware';
import { 
  signupSchema, 
  verifyEmailSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '../schemas/auth.schemas';

const router: Router = express.Router();
router.get("/Test",test)
router.post('/signup', validate(signupSchema), SignUp);
router.post('/validateOtp', validate(verifyEmailSchema), Validateopt);
router.post('/signin', validate(loginSchema), SignIn);
router.post('/forgotPassword', validate(forgotPasswordSchema), ForgotPassword);
router.post('/resetPassword/:token/:id', validate(resetPasswordSchema), ResetPassword);
router.get('/listAll',getAllusers);
router.put("/updateUser/:id",updateUser);
router.delete("/deleteUser/:id",deleteUser);
router.get("/findUserById/:id",findUserById);
export default router;