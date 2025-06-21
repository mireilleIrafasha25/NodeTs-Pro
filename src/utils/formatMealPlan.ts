const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type MealDay = {
  day: string;
  breakfast: string;
  snack: string | string[];
  lunch: string;
  dinner: string;
};

export function formatMealPlanByDay(raw: string | MealDay[], today: Date = new Date()) {
  let parsedPlan: MealDay[];
  try {
    // Parse string if necessary
    if (typeof raw === 'string') {
      parsedPlan = JSON.parse(raw);
    } else {
      parsedPlan = raw;
    }

    // Format result: attach actual weekday name based on today
    const todayIndex = today.getDay();

    const result = parsedPlan.map((entry, i) => ({
      dayName: DAYS[(todayIndex + i) % 7],
      meals: {
        breakfast: entry.breakfast,
        snack: Array.isArray(entry.snack) ? entry.snack : [entry.snack],
        lunch: entry.lunch,
        dinner: entry.dinner,
      },
    }));

    return result;
  } catch (error) {
    console.error('Failed to format meal plan:', error);
    return [];
  }
}
