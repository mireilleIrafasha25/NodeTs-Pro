
// blogController.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppDataSource } from "../config/database";
import { Blog } from "../entity/blog";
import { validationResult } from "express-validator";
import cloudinary from "../utils/cloudinary";
import path from "path";
import asyncWrapper from "../middleware/async"
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/notFoundError";
import {AuthenticatedRequest,ApiResponse} from "../types/common.types";
import { addBlogInput } from "../schemas/blogSchemas";

const blogRepository = AppDataSource.getRepository(Blog);

export const TestBlog = (req: Request, res: Response): void => {
  res.status(200).json({ message: "Welcome to Blog" });
};

export const AddBlog = asyncWrapper(async (
    req: AuthenticatedRequest&addBlogInput, 
    res: Response<ApiResponse>, 
    next: NextFunction)  => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new BadRequestError(errors.array()[0].msg));
    }

    if (!req.file) {
      return next(new BadRequestError( "Image file is required"));
    }

    const filePath = path.resolve(req.file.path);
    const result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    if (!result || !result.url) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const blog = blogRepository.create({
      name: req.body.name,
      description: req.body.description,
      image: result.url,
    });

    const savedBlog = await blogRepository.save(blog);

    res.status(201).json({
        success:true,
         message: "Blog created successfully",
          data: {
            image:savedBlog.image,
            name:savedBlog.name,
            description:savedBlog.description
          }});

}) as RequestHandler;

export const GetBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blogs = await blogRepository.find();
    if (!blogs.length) {
      return next(new NotFoundError("No blog found"));
    }
    res.status(200).json({ size: blogs.length, blogs });
  } catch (error: any) {
    next(error);
  }
};

export const GetBlogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blog = await blogRepository.findOne({ where: { id: req.params.id } });
    if (!blog) {
      return next(new NotFoundError("Blog not found"));
    }
    res.status(200).json({ blog });
  } catch (error: any) {
    next(error);
  }
};

export const UpdateBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new BadRequestError(errors.array()[0].msg));
    }

    const blog = await blogRepository.findOne({ where: { id } });
    if (!blog) {
      return next(new NotFoundError("Blog not found"));
    }

    let imageUrl = blog.image;
    if (req.file) {
      const filePath = path.resolve(req.file.path);
      const result = await cloudinary.uploader.upload(filePath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      if (!result || !result.url) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      imageUrl = result.url;
    }

    blog.name = req.body.title || blog.name;
    blog.description = req.body.description || blog.description;
    blog.image = imageUrl;

    const updatedBlog = await blogRepository.save(blog);

    res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error: any) {
    next(error);
  }
};

export const DeleteBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blog = await blogRepository.findOne({ where: { id: req.params.id } });
    if (!blog) {
    return next(new BadRequestError( "Blog not found") );
    }

    await blogRepository.remove(blog);
    res.status(200).json({ message: "Blog deleted successfully", blog });
  } catch (error: any) {
    next(error);
  }
};
