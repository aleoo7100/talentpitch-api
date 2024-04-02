import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

// route to get all programs listed
export async function getProgramsList(req: Request, res: Response) {
  // get the skip and take values from the pagination middleware
  const { skip, take } = req.pagination;

  try {
    const programs = await prisma.programs.findMany({
      skip,
      take,
    });
    return res.json({
      ok: true,
      data: programs,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to get a program by its id
export async function getProgramsById(req: Request, res: Response) {
  try {
    // get the program by its id with the user included
    const program = await prisma.programs.findUnique({
      where: { programs_id: req.params.id },
      include: { user: true },
    });
    if (!program) {
      return res.status(404).json({
        ok: false,
        error: "program not found",
      });
    }
    return res.json({
      ok: true,
      data: program,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to add a new program
export async function addProgram(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }

    // create a new program
    const program = await prisma.programs.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        users_id: req.body.users_id,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
      },
    });

    if (!program) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado",
      });
    }

    return res.json({
      ok: true,
      data: program,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to update a program by its id
export async function updateProgram(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }

    // update the program by its id
    const program = await prisma.programs.update({
      where: { programs_id: req.params.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        users_id: req.body.users_id,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
      },
    });

    if (!program) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado",
      });
    }

    return res.json({
      ok: true,
      data: program,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to delete a program by its id
export async function deleteProgram(req: Request, res: Response) {
  try {
    // delete the program by its id
    const program = await prisma.programs.delete({
      where: { programs_id: req.params.id },
    });

    if (!program) {
      return res.status(404).json({
        ok: false,
        error: "program not found",
      });
    }

    return res.json({
      ok: true,
      data: "program deleted",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}
