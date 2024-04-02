import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { checkEntityType } from "../helpers/checkEntiyType";

// route to get all programParticipants listed
export async function getProgramParticipantsList(req: Request, res: Response) {
  // get the skip and take values from the pagination middleware
  const { skip, take } = req.pagination;

  try {
    // get all programParticipants from the database paginated
    const programParticipants = await prisma.program_participants.findMany({
      take,
      skip,
    });
    return res.json({
      ok: true,
      data: programParticipants,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to get a programParticipants by its id
export async function getProgramParticipantById(req: Request, res: Response) {
  try {
    // get the programParticipants by its id with the program, user, challenge, and company included
    const programParticipants = await prisma.program_participants.findUnique({
      where: { program_participants_id: req.params.id },
      include: { program: true, user: true, challenge: true, company: true },
    });
    if (!programParticipants) {
      return res.status(404).json({
        ok: false,
        error: "programParticipant not found",
      });
    }
    return res.json({
      ok: true,
      data: programParticipants,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to add a new programParticipants
export async function addProgramParticipant(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }

    //get the entity type by checking the request body
    const entityType = checkEntityType(req.body);

    // create a new programParticipants in the database
    const programParticipants = await prisma.program_participants.create({
      data: {
        entity_type: entityType,
        challenges_id: req.body.challenges_id || null,
        users_id: req.body.users_id || null,
        companies_id: req.body.companies_id || null,
        programs_id: req.body.programs_id,
      },
    });

    return res.json({
      ok: true,
      data: programParticipants,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to update a programParticipants by its id
export async function updateProgramParticipant(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }
    // get the entity type by checking the request body
    const entityType = checkEntityType(req.body);
    // update the programParticipants by its id
    const programParticipants = await prisma.program_participants.update({
      where: { program_participants_id: req.params.id },
      data: {
        programs_id: req.body.program_id,
        entity_type: entityType,
        challenges_id: req.body.challenge_id,
        users_id: req.body.user_id,
        companies_id: req.body.company_id,
      },
    });

    if (!programParticipants) {
      return res.status(404).json({
        ok: false,
        error: "programParticipants not found",
      });
    }

    return res.json({
      ok: true,
      data: programParticipants,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to delete a programParticipants by its id
export async function deleteProgramParticipant(req: Request, res: Response) {
  try {
    // delete the programParticipants by its id
    const programParticipants = await prisma.program_participants.delete({
      where: { program_participants_id: req.params.id },
    });

    if (!programParticipants) {
      return res.status(404).json({
        ok: false,
        error: "programParticipant not found",
      });
    }

    return res.json({
      ok: true,
      data: "programParticipant deleted",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}
