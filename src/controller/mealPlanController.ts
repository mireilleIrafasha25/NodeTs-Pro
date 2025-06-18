import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { UserInfo } from '../entity/userInfo';
import { generateMealPlanFromAI } from '../services/openAi';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';

export const generateMealPlan = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userInfoRepo = AppDataSource.getRepository(UserInfo);
    const userInfo = await userInfoRepo.findOne({
  where: { user:{ id:req.user?.id} },
  relations:["user"] //  Must include this!
});

    if (!userInfo) {
      return res.status(404).json({ success: false, message: 'User info not found' });
    }

    // Construct the prompt using user info
    const prompt = `
      I need a meal plan for a person with the following characteristics:
      - Age: ${userInfo.age}
      - Gender: ${userInfo.gender}
      - Weight: ${userInfo.weight} kg
      - Height: ${userInfo.height} cm
      - Goal: ${userInfo.goal} weight
      - Activity Level: ${userInfo.activityLevel}
      - Has health condition: ${userInfo.healthrelatedDisease ? 'Yes' : 'No'}
      - Is Pregnant: ${userInfo.isPregnant ? `Yes, trimester ${userInfo.pregnancyTrimester}` : 'No'}
      - Is Breastfeeding: ${userInfo.isBreastFeeding ? `Yes, baby is ${userInfo.babyAgeInMonths} months` : 'No'}
      - Dietary restrictions or allergies: ${userInfo.allergies?.join(', ') || 'None'}

      Please provide a 7-day meal plan with 3 meals and 1 snack per day, balanced and customized to this person's needs.
    `;

    const mealPlan = await generateMealPlanFromAI(prompt);

    return res.status(200).json({
      success: true,
      message: 'Meal plan generated successfully',
      data: { mealPlan },
    });

  } catch (error) {
    console.error('Meal plan error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate meal plan',
    });
  }
};
