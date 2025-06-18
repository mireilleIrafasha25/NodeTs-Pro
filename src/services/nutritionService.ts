
import { UserInfo } from "../entity/userInfo";

export type MealPlanInput = {
  userInfo: UserInfo;
};

export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
};

export const calculateDailyCalories = (
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  goal: string
): number => {
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityFactors: Record<string, number> = {
    low: 1.2,
    moderate: 1.55,
    high: 1.9,
  };

  let calories = bmr * (activityFactors[activityLevel] || 1.2);

  if (goal === "lose") calories -= 500;
  else if (goal === "gain") calories += 500;

  return Math.round(calories);
};

export const generateMealPlanPrompt = (userInfo: UserInfo, bmi: number, calories: number): string => {
  return `You are a professional nutritionist. Based on the following user profile, generate a healthy 30-day meal plan:

- Gender: ${userInfo.gender}
- Age: ${userInfo.age}
- Weight: ${userInfo.weight}kg
- Height: ${userInfo.height}cm
- BMI: ${bmi}
- Goal: ${userInfo.goal} (lose/gain/maintain weight)
- Daily Calories Requirement: ${calories}
- Activity Level: ${userInfo.activityLevel}
- Pregnant: ${userInfo.isPregnant ? "Yes" : "No"}${userInfo.pregnancyTrimester ? ", Trimester: " + userInfo.pregnancyTrimester : ""}
- Breastfeeding: ${userInfo.isBreastFeeding ? "Yes" : "No"}${userInfo.babyAgeInMonths ? ", Baby Age: " + userInfo.babyAgeInMonths + " months" : ""}
- Any allergies: ${userInfo.allergies || "None"}
- Health-related conditions: ${userInfo.healthrelatedDisease ? "Yes" : "No"}

Provide a detailed meal plan broken down into breakfast, lunch, dinner, and snacks. Include portion sizes and nutritional values if possible.`;
};
