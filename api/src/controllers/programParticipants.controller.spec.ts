import {
  addProgramParticipant,
  deleteProgramParticipant,
  getProgramParticipantById,
  getProgramParticipantsList,
  updateProgramParticipant,
} from "./programParticipants.controller";
import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

// prismaClient mock for programParticipants
jest.mock("../helpers/prismaClient", () => ({
  program_participants: {
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

// Mock data for programParticipants
const mockProgramParticipants = [
  {
    program_participants_id: "1242fcad-9096-4faa-b93e-f1698120d9c3",
    programs_id: "1242fcad-9096-4faa-b93e-f1698120d9c3",
    entity_type: "USER",
    users_id: "ec4a165f-918e-4bd0-9e25-d32a4f1b1a74",
    companies_id: null,
    challenge_id: null,
    created_at: "2024-04-01T09:42:44.241Z",
    updated_at: "2024-04-01T09:42:44.241Z",
  },
  {
    program_participants_id: "18078851-b6be-449e-9967-7ef2705297ae",
    programs_id: "1242fcad-9096-4faa-b93e-f1698120d9c3",
    entity_type: "COMPANY",
    users_id: null,
    companies_id: "330e8400-e29b-41d4-a716-446655440002",
    challenge_id: null,
    created_at: "2024-04-01T09:41:58.075Z",
    updated_at: "2024-04-01T09:41:58.075Z",
  },
];

describe("getProgramParticipantsList", () => {
  req.pagination = {
    pagination: { skip: 0, take: 10 },
  };

  it("shoud return a list of programParticipants", async () => {
    (prisma.program_participants.findMany as jest.Mock).mockResolvedValue(
      mockProgramParticipants
    );

    await getProgramParticipantsList(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockProgramParticipants,
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.program_participants.findMany as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await getProgramParticipantsList(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("getProgramParticipantsById", () => {
  req.params = { id: mockProgramParticipants[0].program_participants_id };

  it("should return a programParticipant by its id", async () => {
    const mockProgramParticipant = {
      ...mockProgramParticipants[0],
      program: {},
      user: {},
      company: null,
      challenge: null,
    };
    (prisma.program_participants.findUnique as jest.Mock).mockResolvedValue(
      mockProgramParticipant
    );
    await getProgramParticipantById(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockProgramParticipant,
    });
  });

  it("should return an error if the programParticipant is not found", async () => {
    (prisma.program_participants.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    await getProgramParticipantById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "programParticipant not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.program_participants.findUnique as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await getProgramParticipantById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("addProgramParticipant", () => {
  it("should add a new programParticipant", async () => {
    const programParticipant = mockProgramParticipants[0];
    const body = {
      programs_id: mockProgramParticipants[0].programs_id,
      entity_type: mockProgramParticipants[0].entity_type,
      users_id: mockProgramParticipants[0].users_id,
      companies_id: mockProgramParticipants[0].companies_id,
      challenge_id: mockProgramParticipants[0].challenge_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.program_participants.create as jest.Mock).mockResolvedValue(
      programParticipant
    );

    await addProgramParticipant(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: programParticipant,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await addProgramParticipant(req as Request, res as Response);

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
    (prisma.program_participants.create as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await addProgramParticipant(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("updateProgramParticipant", () => {
  req.params = { id: mockProgramParticipants[0].program_participants_id };

  it("should update a programParticipant by its id", async () => {
    const programParticipant = mockProgramParticipants[0];
    const body = {
      programs_id: mockProgramParticipants[0].programs_id,
      entity_type: mockProgramParticipants[0].entity_type,
      users_id: mockProgramParticipants[0].users_id,
      companies_id: mockProgramParticipants[0].companies_id,
      challenge_id: mockProgramParticipants[0].challenge_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.program_participants.update as jest.Mock).mockResolvedValue(
      programParticipant
    );

    await updateProgramParticipant(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: programParticipant,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await updateProgramParticipant(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: ["error"],
    });
  });

  it("should return an error if the programParticipant is not found", async () => {
    const body = {
      programs_id: mockProgramParticipants[0].programs_id,
      entity_type: mockProgramParticipants[0].entity_type,
      users_id: mockProgramParticipants[0].users_id,
      companies_id: mockProgramParticipants[0].companies_id,
      challenge_id: mockProgramParticipants[0].challenge_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.program_participants.update as jest.Mock).mockRejectedValue(
      new Error("programParticipant not found")
    );

    await updateProgramParticipant(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("programParticipant not found"),
    });
  });

  it("should return an error if the query fails", async () => {
    const body = {
      programs_id: mockProgramParticipants[0].programs_id,
      entity_type: mockProgramParticipants[0].entity_type,
      users_id: mockProgramParticipants[0].users_id,
      companies_id: mockProgramParticipants[0].companies_id,
      challenge_id: mockProgramParticipants[0].challenge_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.program_participants.update as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await updateProgramParticipant(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("deleteProgramParticipant", () => {
  req.params = { id: mockProgramParticipants[0].program_participants_id };

  it("should delete a programParticipant by its id", async () => {
    const programParticipant = mockProgramParticipants[0];
    (prisma.program_participants.delete as jest.Mock).mockResolvedValue(
      programParticipant
    );

    await deleteProgramParticipant(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: "programParticipant deleted",
    });
  });

  it("should return an error if the programParticipant is not found", async () => {
    (prisma.program_participants.delete as jest.Mock).mockResolvedValue(null);

    await deleteProgramParticipant(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "programParticipant not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.program_participants.delete as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await deleteProgramParticipant(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});
