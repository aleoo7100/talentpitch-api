import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

// route to get all users listed
export async function getUsersList(req: Request, res: Response) {
  // get the skip and take values from the pagination middleware
  const { skip, take } = req.pagination;

  try {
    const users = await prisma.users.findMany({
      take,
      skip,
    });
    return res.json({
      ok: true,
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to get a user by its id
export async function getUsersById(req: Request, res: Response) {
  try {
    // get the user by its id with the program participants, challenges, companies, and programs included
    const user = await prisma.users.findUnique({
      where: { users_id: req.params.id },
      include: {
        program_participants: { include: { program: true } },
        challenges: true,
        companies: true,
        programs: true,
      },
    });
    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "user not found",
      });
    }
    return res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to add a new user
export async function addUser(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }

    // create a new user
    const user = await prisma.users.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        image_path: req.body.image_path,
      },
    });

    return res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to update a user by its id
export async function updateUser(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }

    // update the user by its id
    const user = await prisma.users.update({
      where: { users_id: req.params.id },
      data: {
        name: req.body.name,
        email: req.body.email,
        image_path: req.body.image_path,
      },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado",
      });
    }

    return res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to delete a user by its id
export async function deleteUser(req: Request, res: Response) {
  try {
    // delete the user by its id
    const user = await prisma.users.delete({
      where: { users_id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "user not found",
      });
    }

    return res.json({
      ok: true,
      data: "user deleted",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}
