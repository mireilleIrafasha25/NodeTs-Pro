import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Meal } from '../entity/mealEntity';
import cloudinary from '../utils/cloudinary';
import path from "path";
import { BadRequestError } from '../error/BadRequestError';
import { AuthenticatedRequest,ApiResponse } from '../types/common.types';
import { error } from 'console';

const mealRepo = AppDataSource.getRepository(Meal);
export const createMeal = async (
  req:AuthenticatedRequest, 
  res: Response<ApiResponse>,
  next:NextFunction
) => {
  try {
    if(!req.file)
    {
      return next(new BadRequestError("Image file is required"))
    }

    const filePath=path.resolve(req.file.path);
    const result=await cloudinary.uploader.upload(
      filePath,{
        use_filename:true,
        unique_filename:false,
        overwrite:true,
      }
    );
    if(!result || !result.url)
    {
      throw new Error("Failed to upload image to cloudinary")
    }
    
    const newMeal = mealRepo.create({
      name:req.body.name,
      description:req.body.description,
      price:req.body.price,
      photo:result.url,
      ingredients: req.body.ingredients,
       mealType: req.body.mealType,
      preparationTime:req.body.preparationTime,
    });

    await mealRepo.save(newMeal);
    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: newMeal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
