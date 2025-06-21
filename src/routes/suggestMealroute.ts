// routes/restaurantRoutes.ts
import { Router } from 'express';
import { getSuggestedMeal } from '../controller/suggestMealController';
import { authenticateToken } from '../middleware/authenthicateToken';

const router = Router();

router.get('/suggested', authenticateToken, getSuggestedMeal);

export default router;
