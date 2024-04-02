import {
  addProgram,
  deleteProgram,
  getProgramsById,
  getProgramsList,
  updateProgram,
} from "./programs.controller";
import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

// prismaClient mock for programs
jest.mock("../helpers/prismaClient", () => ({
  programs: {
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

// Mock data for programs
const mockPrograms = [
  {
    programs_id: "1242fcad-9096-4faa-b93e-f1698120d9c3",
    title: "Program 1",
    description: "Complete program 1",
    start_date: "2024-04-01T09:42:44.241Z",
    end_date: "2024-04-01T09:42:44.241Z",
    users_id: "ec4a165f-918e-4bd0-9e25-d32a4f1b1a74",
    created_at: "2024-04-01T09:42:44.241Z",
    updated_at: "2024-04-01T09:42:44.241Z",
  },
  {
    programs_id: "18078851-b6be-449e-9967-7ef2705297ae",
    title: "Program 2",
    description: "Cras sed magna sit amet risus ebiquam luctus.",
    start_date: "2024-04-01T09:42:44.241Z",
    end_date: "2024-04-01T09:42:44.241Z",
    users_id: "330e8400-e29b-41d4-a716-446655440002",
    created_at: "2024-04-01T09:41:58.075Z",
    updated_at: "2024-04-01T09:41:58.075Z",
  },
];

describe("getProgramsList", () => {
  req.pagination = {
    pagination: { skip: 0, take: 10 },
  };

  it("shoud return a list of programs", async () => {
    (prisma.programs.findMany as jest.Mock).mockResolvedValue(mockPrograms);

    await getProgramsList(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockPrograms,
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.programs.findMany as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await getProgramsList(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("getProgramsById", () => {
  req.params = { id: mockPrograms[0].programs_id };

  it("should return a program by its id", async () => {
    const mockProgram = {
      ...mockPrograms[0],
      program_participants: [],
    };
    (prisma.programs.findUnique as jest.Mock).mockResolvedValue(mockProgram);
    await getProgramsById(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockProgram,
    });
  });

  it("should return an error if the program is not found", async () => {
    (prisma.programs.findUnique as jest.Mock).mockResolvedValue(null);
    await getProgramsById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "program not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.programs.findUnique as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await getProgramsById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("addProgram", () => {
  it("should add a new program", async () => {
    const program = mockPrograms[0];
    const body = {
      title: mockPrograms[0].title,
      description: mockPrograms[0].description,
      start_date: mockPrograms[0].start_date,
      end_date: mockPrograms[0].end_date,
      users_id: mockPrograms[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.programs.create as jest.Mock).mockResolvedValue(program);

    await addProgram(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: program,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await addProgram(req as Request, res as Response);

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
    (prisma.programs.create as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await addProgram(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("updateProgram", () => {
  req.params = { id: mockPrograms[0].programs_id };

  it("should update a program by its id", async () => {
    const program = mockPrograms[0];
    const body = {
      title: mockPrograms[0].title,
      description: mockPrograms[0].description,
      start_date: mockPrograms[0].start_date,
      end_date: mockPrograms[0].end_date,
      users_id: mockPrograms[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.programs.update as jest.Mock).mockResolvedValue(program);

    await updateProgram(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: program,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await updateProgram(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: ["error"],
    });
  });

  it("should return an error if the program is not found", async () => {
    const body = {
      title: mockPrograms[0].title,
      description: mockPrograms[0].description,
      start_date: mockPrograms[0].start_date,
      end_date: mockPrograms[0].end_date,
      users_id: mockPrograms[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.programs.update as jest.Mock).mockRejectedValue(
      new Error("program not found")
    );

    await updateProgram(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("program not found"),
    });
  });

  it("should return an error if the query fails", async () => {
    const body = {
      title: mockPrograms[0].title,
      description: mockPrograms[0].description,
      start_date: mockPrograms[0].start_date,
      end_date: mockPrograms[0].end_date,
      users_id: mockPrograms[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.programs.update as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await updateProgram(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("deleteProgram", () => {
  req.params = { id: mockPrograms[0].programs_id };

  it("should delete a program by its id", async () => {
    const program = mockPrograms[0];
    (prisma.programs.delete as jest.Mock).mockResolvedValue(program);

    await deleteProgram(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: "program deleted",
    });
  });

  it("should return an error if the program is not found", async () => {
    (prisma.programs.delete as jest.Mock).mockResolvedValue(null);

    await deleteProgram(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "program not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.programs.delete as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await deleteProgram(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});
