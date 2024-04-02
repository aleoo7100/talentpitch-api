import {
  addCompany,
  deleteCompany,
  getCompanyById,
  getCompaniesList,
  updateCompany,
} from "./companies.controller";
import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

// prismaClient mock for companies
jest.mock("../helpers/prismaClient", () => ({
  companies: {
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

// Mock data for companies
const mockCompanies = [
  {
    companies_id: "1242fcad-9096-4faa-b93e-f1698120d9c3",
    name: "Tech Innovations Inc.",
    image_path: "/images/tech-innovations.png",
    location: "Silicon Valley, CA",
    industry: "Technology",
    users_id: "user123",
    created_at: "2024-04-01T09:42:44.241Z",
    updated_at: "2024-04-01T09:42:44.241Z",
  },
  {
    companies_id: "18078851-b6be-449e-9967-7ef2705297ae",
    name: "Design Solutions Ltd.",
    image_path: "/images/design-solutions.png",
    location: "New York, NY",
    industry: "Design",
    users_id: "user456",
    created_at: "2024-04-01T09:41:58.075Z",
    updated_at: "2024-04-01T09:41:58.075Z",
  },
];

describe("getCompaniesList", () => {
  req.pagination = {
    pagination: { skip: 0, take: 10 },
  };
  it("shoud return a list of Companies", async () => {
    (prisma.companies.findMany as jest.Mock).mockResolvedValue(mockCompanies);

    await getCompaniesList(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockCompanies,
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.companies.findMany as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await getCompaniesList(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("getCompaniesById", () => {
  req.params = { id: mockCompanies[0].companies_id };

  it("should return a company by its id", async () => {
    const mockcompany = {
      ...mockCompanies[0],
      program_participants: [],
    };
    (prisma.companies.findUnique as jest.Mock).mockResolvedValue(mockcompany);
    await getCompanyById(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockcompany,
    });
  });

  it("should return an error if the company is not found", async () => {
    (prisma.companies.findUnique as jest.Mock).mockResolvedValue(null);
    await getCompanyById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "company not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.companies.findUnique as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await getCompanyById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("addcompany", () => {
  it("should add a new company", async () => {
    const company = mockCompanies[0];
    const body = {
      name: mockCompanies[0].name,
      image_path: mockCompanies[0].image_path,
      location: mockCompanies[0].location,
      industry: mockCompanies[0].industry,
      users_id: mockCompanies[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.companies.create as jest.Mock).mockResolvedValue(company);

    await addCompany(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: company,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await addCompany(req as Request, res as Response);

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
    (prisma.companies.create as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await addCompany(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("updateCompany", () => {
  req.params = { id: mockCompanies[0].companies_id };

  it("should update a company by its id", async () => {
    const company = mockCompanies[0];
    const body = {
      name: mockCompanies[0].name,
      image_path: mockCompanies[0].image_path,
      location: mockCompanies[0].location,
      industry: mockCompanies[0].industry,
      users_id: mockCompanies[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.companies.update as jest.Mock).mockResolvedValue(company);

    await updateCompany(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: company,
    });
  });

  it("should return an error if there are validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => ["error"],
    });

    await updateCompany(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: ["error"],
    });
  });

  it("should return an error if the company is not found", async () => {
    const body = {
      name: mockCompanies[0].name,
      image_path: mockCompanies[0].image_path,
      location: mockCompanies[0].location,
      industry: mockCompanies[0].industry,
      users_id: mockCompanies[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.companies.update as jest.Mock).mockRejectedValue(
      new Error("company not found")
    );

    await updateCompany(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("company not found"),
    });
  });

  it("should return an error if the query fails", async () => {
    const body = {
      name: mockCompanies[0].name,
      image_path: mockCompanies[0].image_path,
      location: mockCompanies[0].location,
      industry: mockCompanies[0].industry,
      users_id: mockCompanies[0].users_id,
    };
    req.body = body;
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (prisma.companies.update as jest.Mock).mockRejectedValue(
      new Error("test error")
    );

    await updateCompany(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});

describe("deleteCompany", () => {
  req.params = { id: mockCompanies[0].companies_id };

  it("should delete a company by its id", async () => {
    const company = mockCompanies[0];
    (prisma.companies.delete as jest.Mock).mockResolvedValue(company);

    await deleteCompany(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: "company deleted",
    });
  });

  it("should return an error if the company is not found", async () => {
    (prisma.companies.delete as jest.Mock).mockResolvedValue(null);

    await deleteCompany(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "company not found",
    });
  });

  it("should return an error if the query fails", async () => {
    (prisma.companies.delete as jest.Mock).mockRejectedValue(
      new Error("test error")
    );
    await deleteCompany(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: new Error("test error"),
    });
  });
});
