import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Order } from '../entity/OrderEntity';
import { Meal } from '../entity/mealEntity';
import { User } from '../entity/userEntity';

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { userId, mealId, deliveryTime } = req.body;

    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    const meal = await AppDataSource.getRepository(Meal).findOneBy({ id: mealId });

    if (!user || !meal) {
      return res.status(404).json({ success: false, message: 'User or Meal not found' });
    }

    const orderRepo = AppDataSource.getRepository(Order);
    const order = orderRepo.create({
      meal,
      deliveryTime,
      totalPrice: meal.price,
      status: 'pending',
      user
    });

    await orderRepo.save(order);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
