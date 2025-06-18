import { Router } from 'express';
import { generateMealPlan } from '../controller/mealPlanController';
import { authenticateToken } from '../middleware/authenthicateToken';

const router = Router();

router.post('/generate', authenticateToken, generateMealPlan);

export default router;
