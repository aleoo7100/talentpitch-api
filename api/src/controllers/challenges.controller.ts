import prisma from "../../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

// route to get all challenges listed
export async function getChallengesList(req: Request, res: Response) {
  // get the skip and take values from the pagination middleware
  const { skip, take } = req.pagination;

  try {
    // get all challenges from the database paginated
    const challenges = await prisma.challenges.findMany({
      take,
      skip,
    });
    return res.json({
      ok: true,
      data: challenges,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to get a challenge by its id
export async function getChallengesById(req: Request, res: Response) {
  try {
    // get the challenge by its id with the program participants included
    const challenge = await prisma.challenges.findUnique({
      where: { challenges_id: req.params.id },
      include: { program_participants: { include: { program: true } } },
    });
    // if the challenge is not found, return an error
    if (!challenge) {
      return res.status(404).json({
        ok: false,
        error: "challenge not found",
      });
    }
    return res.json({
      ok: true,
      data: challenge,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to add a new challenge
export async function addChallenge(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }

    // create a new challenge
    const challenge = await prisma.challenges.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        users_id: req.body.user_id,
        difficulty: req.body.difficulty,
      },
    });

    return res.json({
      ok: true,
      data: challenge,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to update a challenge by its id
export async function updateChallenge(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }

    // update the challenge
    const challenge = await prisma.challenges.update({
      where: { challenges_id: req.params.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        users_id: req.body.user_id,
        difficulty: req.body.difficulty,
      },
    });

    // if the challenge is not found, return an error
    if (!challenge) {
      return res.status(404).json({
        ok: false,
        error: "challenge not found",
      });
    }

    return res.json({
      ok: true,
      data: challenge,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to delete a challenge by its id
export async function deleteChallenge(req: Request, res: Response) {
  try {
    // delete the challenge
    const challenge = await prisma.challenges.delete({
      where: { challenges_id: req.params.id },
    });

    // if the challenge is not found, return an error
    if (!challenge) {
      return res.status(404).json({
        ok: false,
        error: "challenge not found",
      });
    }

    return res.json({
      ok: true,
      data: "challenge deleted",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}
