
import express ,{Router} from "express";
import {AddBlog} from "../controller/blogController"
import {validate} from "../middleware/validation.middleware"
import {addBlogSchema} from "../schemas/blogSchemas"
import upload from "../middleware/multer"
import {authenticateToken,authorize} from "../middleware/authenthicateToken"
const route:Router=express.Router();

route.post('/addBlog',authenticateToken,authorize("admin"),upload.single('image'),validate(addBlogSchema),AddBlog);

export default route;