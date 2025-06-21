import { Router } from 'express';
import { generateMealPlan,getTodayMealPlan } from '../controller/mealPlanController';
import { authenticateToken } from '../middleware/authenthicateToken';

const router = Router();

router.post('/generate', authenticateToken, generateMealPlan);
router.get('/todayMeal', authenticateToken, getTodayMealPlan);
export default router;
