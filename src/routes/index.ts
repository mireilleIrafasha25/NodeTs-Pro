import UserRoute from "./authRoute";
import BlogRoute from "./blogRoute";
import express ,{Router} from "express";

const router:Router=express.Router();

router.use("/user",UserRoute)
router.use("/blog",BlogRoute)

export default router;
