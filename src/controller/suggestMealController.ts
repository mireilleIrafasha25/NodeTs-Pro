import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { UserInfo } from '../entity/userInfo';
import { Meal } from '../entity/mealEntity';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';

const userInfoRepo = AppDataSource.getRepository(UserInfo);
const mealRepo = AppDataSource.getRepository(Meal);

export const getSuggestedMeal = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user?.id;
    
    //  Determine current meal type based on time
    const hour = new Date().getHours();
    let mealType: 'breakfast' | 'lunch' | 'dinner'|'snack';

    if (hour >= 6 && hour < 10) mealType = 'breakfast';
    else if(hour >=10 && hour<12) mealType='snack';
    else if (hour >= 12 && hour < 15) mealType = 'lunch';
    else if (hour >= 18 && hour < 21) mealType = 'dinner';
    else return res.status(400).json({ success: false, message: 'No suggestion available at this time' });

    //  Fetch user info
    const userInfo = await userInfoRepo.findOne({ where: { user: { id: userId } } });
    if (!userInfo || !userInfo.mealPlan) {
      return res.status(404).json({ success: false, message: `No meal plan found` });
    }

    //  CHANGED: Parse mealPlan if it's not already an array
    const mealPlan = Array.isArray(userInfo.mealPlan)
      ? userInfo.mealPlan
      : JSON.parse(userInfo.mealPlan); // <-- Parsed from stored JSON

    //  Get today's meal
    const today = new Date().getDay(); // 0 = Sunday
    const todayPlan = mealPlan[today];

    if (!todayPlan || !todayPlan[mealType]) {
      return res.status(404).json({ success: false, message: `No meal plan found for ${mealType}` });
    }

    const mealText = todayPlan[mealType]; // e.g., 'breakfast1'
      console.log('Meal to match:', mealText);
      console.log('Parsed meal plan:', mealPlan);

    //  CHANGED: Match meal name case-insensitively
    const suggestedMeals = await mealRepo
      .createQueryBuilder("meal")
      .where("LOWER(meal.name) = LOWER(:name)", { name: mealText })
      .getMany();

    return res.json({
      success: true,
      message: "Meal Suggested",
      data: suggestedMeals,
    });

  } catch (error) {
    console.error('Error suggesting meal:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
