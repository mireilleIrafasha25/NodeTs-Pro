import express, { Router } from "express";
import upload from "../middleware/multer";
import { createMeal } from "../controller/mealController";
const route:Router=express.Router();

route.post("/addMeal",upload.single("photo"),createMeal)

export default route