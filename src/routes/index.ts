import UserRoute from "./authRoute";
import BlogRoute from "./blogRoute";
import UserInfoRoute from "./userInfoRoute"
import express ,{Router} from "express";
import MealPlan from "./mealPlanRoute"
import SuggestMeal from "./suggestMealroute"
import Meal from "./mealRoute"
const router:Router=express.Router();
router.use("/user",UserRoute)
router.use("/blog",BlogRoute)
router.use("/userInfo",UserInfoRoute)
router.use("/mealPlan",MealPlan)
router.use("/restaurant",SuggestMeal)
router.use("/restaurantMeal",Meal)
export default router;
