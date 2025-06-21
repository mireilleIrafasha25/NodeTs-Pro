import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { UserInfo } from '../entity/userInfo';
import { generateMealPlanFromAI } from '../services/openAi';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { formatMealPlanByDay } from '../utils/formatMealPlan'; 

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
Generate a 7-day meal plan for the following person:
- Age: ${userInfo.age}
- Gender: ${userInfo.gender}
- Weight: ${userInfo.weight} kg
- Height: ${userInfo.height} cm
- Goal: ${userInfo.goal} weight
- Activity Level: ${userInfo.activityLevel}
- Has health condition: ${userInfo.healthrelatedDisease ? 'Yes' : 'No'}
- Is Pregnant: ${userInfo.isPregnant ? `Yes, trimester ${userInfo.pregnancyTrimester}` : 'No'}
- Is Breastfeeding: ${userInfo.isBreastFeeding ? `Yes, baby is ${userInfo.babyAgeInMonths} months` : 'No'}
- Allergies: ${userInfo.allergies?.join(', ') || 'None'}

Return the response as a JSON array of 7 objects. Each object should be structured like this:
{
  "day": "Monday",
  "breakfast": "...",
  "snack": "...",
  "lunch": "...",
  "dinner": "..."
}
  Only return the JSON array.
`;


    const mealPlan = await generateMealPlanFromAI(prompt);
    console.log('AI response:', mealPlan);
      //  save to DB
      userInfo.mealPlan = mealPlan;
      await userInfoRepo.save(userInfo);
     //format for client response 
     const formattedPlan=formatMealPlanByDay(mealPlan)

    return res.status(200).json({
      success: true,
      message: 'Meal plan generated successfully',
      data: {
         mealPlan:formattedPlan },
    });

  } catch (error) {
    console.error('Meal plan error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate meal plan',
    });
  }
};





export const getTodayMealPlan = async (
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
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!userInfo || !userInfo.mealPlan) {
      return res.status(404).json({ success: false, message: 'No meal plan found' });
    }

    const formatted = formatMealPlanByDay(userInfo.mealPlan);
    const todayIndex = new Date().getDay(); // 0 = Sunday
    const todayPlan = formatted[todayIndex];

    if (!todayPlan) {
      return res.status(404).json({ success: false, message: "Today's meal plan not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Today's meal plan",
      data: todayPlan,
    });
  } catch (error) {
    console.error('Error fetching today’s meal:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
