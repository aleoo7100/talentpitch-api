import {
  addChallenge,
  deleteChallenge,
  getChallengeById,
  getChallengesList,
  updateChallenge,
} from "./challenges.controller";
import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

// prismaClient mock for challenges
jest.mock("../helpers/prismaClient", () => ({
  challenges: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// express-validator mock
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

// Request and Response mock
const req: Partial<Request> = {};
const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// Mock data for challenges
const mockChallenges = [
  {
    challenges_id: "1242fcad-9096-4faa-b93e-f1698120d9c3",
    title: "Challenge 3",
    description: "Complete challenge 3",
    difficulty: 3,
    users_id: "ec4a165f-918e-4bd0-9e25-d32a4f1b1a74",
    created_at: "2024-04-01T09:42:44.241Z",
    updated_at: "2024-04-01T09:42:44.241Z",
  },
  {
    challenges_id: "18078851-b6be-449e-9967-7ef2705297ae",
    title: "Challenge 5",
    description: "Cras sed magna sit amet risus ebiquam luctus.",
    difficulty: 2,
    users_id: "330e8400-e29b-41d4-a716-446655440002",
    created_at: "2024-04-01T09:41:58.075Z",
    updated_at: "2024-04-01T09:41:58.075Z",
  },
];

describe("getChallengesList", () => {
  req.pagination = {
    pagination: { skip: 0, take: 10 },
  };

  it("shoud return a list of challenges", async () => {
    (prisma.challenges.findMany as jest.Mock).mockResolvedValue(mockChallenges);

    await getChallengesList(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockChallenges,
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.challenges.findMany as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await getChallengesList(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("getChallengesById", () => {
  req.params = { id: mockChallenges[0].challenges_id };

  it("should return a challenge by its id", async () => {
    const mockChallenge = {
      ...mockChallenges[0],
      program_participants: [],
    };
    (prisma.challenges.findUnique as jest.Mock).mockResolvedValue(
      mockChallenge
    );
    await getChallengeById(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockChallenge,
    });
  });

  it("should return an error if the challenge is not found", async () => {
    (prisma.challenges.findUnique as jest.Mock).mockResolvedValue(null);
    await getChallengeById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "challenge not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.challenges.findUnique as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await getChallengeById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("addChallenge", () => {
  it("should add a new challenge", async () => {
    const challenge = mockChallenges[0];
    const body = {
      title: mockChallenges[0].title,
      description: mockChallenges[0].description,
      difficulty: mockChallenges[0].difficulty,
      users_id: mockChallenges[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.challenges.create as jest.Mock).mockResolvedValue(challenge);

    await addChallenge(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: challenge,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await addChallenge(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: ["error"],
    });
  });

  it("should return an error if the query fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.challenges.create as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await addChallenge(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("updateChallenge", () => {
  req.params = { id: mockChallenges[0].challenges_id };

  it("should update a challenge by its id", async () => {
    const challenge = mockChallenges[0];
    const body = {
      title: mockChallenges[0].title,
      description: mockChallenges[0].description,
      difficulty: mockChallenges[0].difficulty,
      users_id: mockChallenges[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.challenges.update as jest.Mock).mockResolvedValue(challenge);

    await updateChallenge(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: challenge,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await updateChallenge(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: ["error"],
    });
  });

  it("should return an error if the challenge is not found", async () => {
    const body = {
      title: mockChallenges[0].title,
      description: mockChallenges[0].description,
      difficulty: mockChallenges[0].difficulty,
      users_id: mockChallenges[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.challenges.update as jest.Mock).mockRejectedValue(
      new Error("challenge not found")
    );

    await updateChallenge(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("challenge not found"),
    });
  });

  it("should return an error if the query fails", async () => {
    const body = {
      title: mockChallenges[0].title,
      description: mockChallenges[0].description,
      difficulty: mockChallenges[0].difficulty,
      users_id: mockChallenges[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.challenges.update as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await updateChallenge(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("deleteChallenge", () => {
  req.params = { id: mockChallenges[0].challenges_id };

  it("should delete a challenge by its id", async () => {
    const challenge = mockChallenges[0];
    (prisma.challenges.delete as jest.Mock).mockResolvedValue(challenge);

    await deleteChallenge(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: "challenge deleted",
    });
  });

  it("should return an error if the challenge is not found", async () => {
    (prisma.challenges.delete as jest.Mock).mockResolvedValue(null);

    await deleteChallenge(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "challenge not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.challenges.delete as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await deleteChallenge(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});
