import {
  addUser,
  deleteUser,
  getUserById,
  getUsersList,
  updateUser,
} from "./users.controller";
import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

// prismaClient mock for users
jest.mock("../helpers/prismaClient", () => ({
  users: {
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

// Mock data for users
const mockUsers = [
  {
    users_id: "1242fcad-9096-4faa-b93e-f1698120d9c3",
    email: "jhondoe@example.com",
    name: "Jhon",
    image_path: "/images/jhon.jpg",
    created_at: "2024-04-01T09:42:44.241Z",
    updated_at: "2024-04-01T09:42:44.241Z",
  },
  {
    users_id: "18078851-b6be-449e-9967-7ef2705297ae",
    email: "jhondoe@example.com",
    name: "Jhon",
    image_path: "/images/jhon.jpg",
    created_at: "2024-04-01T09:41:58.075Z",
    updated_at: "2024-04-01T09:41:58.075Z",
  },
];

describe("getUsersList", () => {
  req.pagination = {
    pagination: { skip: 0, take: 10 },
  };

  it("shoud return a list of users", async () => {
    (prisma.users.findMany as jest.Mock).mockResolvedValue(mockUsers);

    await getUsersList(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockUsers,
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.users.findMany as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await getUsersList(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("getUsersById", () => {
  req.params = { id: mockUsers[0].users_id };

  it("should return a user by its id", async () => {
    const mockUser = {
      ...mockUsers[0],
      program_participants: [],
    };
    (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);
    await getUserById(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockUser,
    });
  });

  it("should return an error if the user is not found", async () => {
    (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);
    await getUserById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "user not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.users.findUnique as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await getUserById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("addUser", () => {
  it("should add a new user", async () => {
    const user = mockUsers[0];
    const body = {
      email: mockUsers[0].email,
      name: mockUsers[0].name,
      image_path: mockUsers[0].image_path,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.users.create as jest.Mock).mockResolvedValue(user);

    await addUser(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: user,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await addUser(req as Request, res as Response);

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
    (prisma.users.create as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await addUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("updateUser", () => {
  req.params = { id: mockUsers[0].users_id };

  it("should update a user by its id", async () => {
    const user = mockUsers[0];
    const body = {
      email: mockUsers[0].email,
      name: mockUsers[0].name,
      image_path: mockUsers[0].image_path,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.users.update as jest.Mock).mockResolvedValue(user);

    await updateUser(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: user,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await updateUser(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: ["error"],
    });
  });

  it("should return an error if the user is not found", async () => {
    const body = {
      email: mockUsers[0].email,
      name: mockUsers[0].name,
      image_path: mockUsers[0].image_path,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.users.update as jest.Mock).mockRejectedValue(
      new Error("user not found")
    );

    await updateUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("user not found"),
    });
  });

  it("should return an error if the query fails", async () => {
    const body = {
      email: mockUsers[0].email,
      name: mockUsers[0].name,
      image_path: mockUsers[0].image_path,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.users.update as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await updateUser(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("deleteUser", () => {
  req.params = { id: mockUsers[0].users_id };

  it("should delete a user by its id", async () => {
    const user = mockUsers[0];
    (prisma.users.delete as jest.Mock).mockResolvedValue(user);

    await deleteUser(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: "user deleted",
    });
  });

  it("should return an error if the user is not found", async () => {
    (prisma.users.delete as jest.Mock).mockResolvedValue(null);

    await deleteUser(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "user not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.users.delete as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await deleteUser(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});
