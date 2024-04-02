import prisma from "../helpers/prismaClient";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

// route to get all companies listed
export async function getCompaniesList(req: Request, res: Response) {
  // get the skip and take values from the pagination middleware
  const { skip, take } = req.pagination;

  try {
    // get all companies from the database paginated
    const companies = await prisma.companies.findMany({
      take,
      skip,
    });
    return res.json({
      ok: true,
      data: companies,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to get a company by its id
export async function getCompaniesById(req: Request, res: Response) {
  try {
    // get the company by its id with the program participants included
    const company = await prisma.companies.findUnique({
      where: { companies_id: req.params.id },
      include: { program_participants: { include: { program: true } } },
    });
    if (!company) {
      return res.status(404).json({
        ok: false,
        error: "company not found",
      });
    }
    return res.json({
      ok: true,
      data: company,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to add a new company
export async function addCompany(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }

    // create a new company in the database
    const company = await prisma.companies.create({
      data: {
        name: req.body.name,
        industry: req.body.industry,
        location: req.body.location,
        users_id: req.body.users_id,
      },
    });

    return res.json({
      ok: true,
      data: company,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to update a company by its id
export async function updateCompany(req: Request, res: Response) {
  try {
    // check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        ok: false,
        error: errors.array(),
      });
    }

    // update the company by its id
    const company = await prisma.companies.update({
      where: { companies_id: req.params.id },
      data: {
        name: req.body.name,
        industry: req.body.industry,
        location: req.body.location,
        users_id: req.body.users_id,
      },
    });

    if (!company) {
      return res.status(404).json({
        ok: false,
        error: "company not found",
      });
    }

    return res.json({
      ok: true,
      data: company,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

// route to delete a company by its id
export async function deleteCompany(req: Request, res: Response) {
  try {
    // delete the company by its id
    const company = await prisma.companies.delete({
      where: { companies_id: req.params.id },
    });

    if (!company) {
      return res.status(404).json({
        ok: false,
        error: "company not found",
      });
    }

    return res.json({
      ok: true,
      data: "company deleted",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}
