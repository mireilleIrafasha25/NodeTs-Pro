import UserRoute from "./authRoute";
import BlogRoute from "./blogRoute";
import UserInfoRoute from "./userInfoRoute"
import express ,{Router} from "express";
import MealPlan from "./mealPlanRoute"
const router:Router=express.Router();
router.use("/user",UserRoute)
router.use("/blog",BlogRoute)
router.use("/userInfo",UserInfoRoute)
router.use("/mealPlan",MealPlan)
export default router;
