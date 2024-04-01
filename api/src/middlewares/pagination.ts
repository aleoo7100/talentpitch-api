import { Request, Response, NextFunction } from "express";

// Middleware function to add pagination to the request object
export const pagination = (pageSize: number = 10) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let page: number = parseInt(req.query.page as string) || 1;
    page = page < 1 ? 1 : page;

    const skip: number = (page - 1) * pageSize;
    const take: number = pageSize;

    req.pagination = { skip, take };

    next();
  };
};
