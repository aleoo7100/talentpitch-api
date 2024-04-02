import { insertDummyData } from "./gptInteractions.controller";
import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { createCompletion } from "../helpers/openaiClient";

jest.mock("../helpers/openaiClient", () => ({
  createCompletion: jest.fn(),
}));

jest.mock("../helpers/prismaClient", () => ({
  users: { createMany: jest.fn() },
  challenges: { createMany: jest.fn() },
  companies: { createMany: jest.fn() },
  programs: { createMany: jest.fn() },
  program_participants: { createMany: jest.fn() },
}));

const req: Partial<Request> = {};
const res: Partial<Response> = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
};

describe("insertDummyData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create dummy data and insert it into the database", async () => {
    const mockData = {
      users: [],
      challenges: [],
      companies: [],
      programs: [],
      program_participants: [],
    };
    (createCompletion as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

    await insertDummyData(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockData,
    });
  });

  it("should return an error if createCompletion fails", async () => {
    (createCompletion as jest.Mock).mockRejectedValue(
      new Error("createCompletion error")
    );

    await insertDummyData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("createCompletion error"),
    });
  });

  it("should return an error if prisma.users.createMany fails", async () => {
    const mockData = {
      users: [],
      challenges: [],
      companies: [],
      programs: [],
      program_participants: [],
    };
    (createCompletion as jest.Mock).mockResolvedValue(JSON.stringify(mockData));
    (prisma.users.createMany as jest.Mock).mockRejectedValue(
      new Error("users createMany error")
    );

    await insertDummyData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("users createMany error"),
    });
  });
});
