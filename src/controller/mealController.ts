import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Meal } from '../entity/mealEntity';

export const createMeal = async (req: Request, res: Response) => {
  try {
    const { name, description, price, ingredients, preparationTime } = req.body;
    const photo = req.file?.path || ''; // if you're using multer to upload

    const mealRepo = AppDataSource.getRepository(Meal);
    const newMeal = mealRepo.create({
      name,
      description,
      price,
      photo,
      ingredients,
      preparationTime,
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
