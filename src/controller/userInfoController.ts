// controllers/userInfoController.ts
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { UserInfo } from "../entity/userInfo";
import { User } from "../entity/userEntity";
import { AuthenticatedRequest,ApiResponse } from "../types/common.types";
import asyncWrapper from "../middleware/async";
import { size } from "zod/v4";
import { fa } from "zod/v4/locales";
import { NotFoundError } from "../error/notFoundError";
const userInfoRepo = AppDataSource.getRepository(UserInfo);

export const saveUserInfo = async(
     req: AuthenticatedRequest,
     res: Response<ApiResponse>,
    next:NextFunction) => {
  const { weight, height, age, gender, goal,babyAgeInMonths,
    isPregnant,pregnancyTrimester,isBreastFeeding,
    healthrelatedDisease,haveBreastMilk,allergies,activityLevel} = req.body;
  const userId = req.user?.id;
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: userId });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
    //  if(!isPregnant && gender==='male')
    //  {
    //     pregnancyTrimester===0;
    //     isBreastFeeding===false
    //  }
  
  const userInfo = userInfoRepo.create(
    {
         weight,
        height,
        age, 
        gender,
        goal,
        isPregnant,
        pregnancyTrimester,
        isBreastFeeding,
        healthrelatedDisease,
        haveBreastMilk,
        allergies,
        activityLevel,
        babyAgeInMonths,
        user
    }
);
  await userInfoRepo.save(userInfo);
  res.status(201).json(
    {
     success: true,
      message: "User info saved", 
      data: userInfo 
    }
);
};

export const deleteUserInfo = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const id = req.params.id;
    const userRepo = AppDataSource.getRepository(UserInfo);
    const userInfo = await userRepo.findOneBy({ id });

    if (!userInfo) return res.status(404).json({ message: 'User not found' });
    await userRepo.remove(userInfo);
    res.status(200).json({ message: 'User information deleted successfully' });}
    catch(err)
    {
        return next(err)
    }
};

export const getAllUsersInformation=asyncWrapper(
  async(req:AuthenticatedRequest,
    res:Response<ApiResponse>,next:NextFunction)=>
{
     const userInfo= await AppDataSource.getRepository(UserInfo).find();
     res.status(200).json({
      success:true,
      message:"All UsersInformation displayed",
      data:
      {
        size:userInfo.length,
        usersInfo:userInfo
      }
    })
      
})

export const UpdateUserInfo =asyncWrapper(async(req:AuthenticatedRequest,
    res:Response<ApiResponse>,
    next:NextFunction
  )=>
{
 const id=req.params.id;
 const updateduserInfo=req.body;
 const userInfo=await userInfoRepo.findOneBy({id});
 if(!userInfo) return next(new NotFoundError("User Information not found"))
 const updateUserInfo=userInfoRepo.merge(userInfo,updateduserInfo);
 await userInfoRepo.save(updateUserInfo)
 res.status(200).json({
  success:true,
  message:"User information updated successfully",
  data:updateUserInfo
})

})