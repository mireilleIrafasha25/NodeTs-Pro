import express,{Router} from "express";
import {saveUserInfo,deleteUserInfo,getAllUsersInformation,UpdateUserInfo} from "../controller/userInfoController"
import {authenticateToken,authorize} from "../middleware/authenthicateToken"
const router:Router=express.Router();
router.post("/saveUserInfo",authenticateToken,saveUserInfo)
router.delete("/deleteuserInfo/:id",deleteUserInfo)
router.get("/list",getAllUsersInformation)
router.put("/updateUserInfo/:id",UpdateUserInfo)
export default router;