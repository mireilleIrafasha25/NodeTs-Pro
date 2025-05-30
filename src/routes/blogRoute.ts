
import express ,{Router} from "express";
import {AddBlog} from "../controller/blogController"
import {validate} from "../middleware/validation.middleware"
import {addBlogSchema} from "../schemas/blogSchemas"

const route:Router=express.Router();

route.post('/addBlog',validate(addBlogSchema),AddBlog);

export default route;