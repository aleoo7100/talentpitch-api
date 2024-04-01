import { check } from "express-validator";

// Middleware check if the body of the request of user is valid
export const checkUser = [
  check("name").exists().withMessage("name is required"),
  check("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is not valid"),
  check("image_path").exists().withMessage("image_path is required"),
];

// Middleware check if the body of the request of challenge is valid
export const checkChallenge = [
  check("title").exists().withMessage("title is required"),
  check("description").exists().withMessage("description is required"),
  check("user_id")
    .exists()
    .withMessage("user_id is required")
    .isUUID()
    .withMessage("user_id is not valid"),
  check("difficulty")
    .exists()
    .withMessage("difficulty is required")
    .isInt()
    .withMessage("difficulty is not valid, must be integer"),
];

// Middleware check if the body of the request of program is valid
export const checkProgram = [
  check("title").exists().withMessage("title is required"),
  check("description").exists().withMessage("description is required"),
  check("users_id")
    .exists()
    .withMessage("users_id is required")
    .isUUID()
    .withMessage("users_id is not valid"),
  check("start_date")
    .exists()
    .withMessage("start_date is required")
    .isDate()
    .withMessage("start_date is not valid"),
  check("end_date")
    .exists()
    .withMessage("end_date is required")
    .isDate()
    .withMessage("end_date is not valid"),
];

// Middleware check if the body of the request of company is valid
export const checkCompany = [
  check("name").exists().withMessage("name is required"),
  check("industry").exists().withMessage("industry is required"),
  check("location").exists().withMessage("location is required"),
  check("users_id")
    .exists()
    .withMessage("users_id is required")
    .isUUID()
    .withMessage("users_id is not valid"),
];

// Middleware check if the body of the request of program participants is valid
export const checkProgramParticipants = [
  check("programs_id").exists().withMessage("programs_id is required"),
  check().custom((value, { req }) => {
    if (
      !req.body.companies_id &&
      !req.body.users_id &&
      !req.body.challenges_id
    ) {
      throw new Error(
        "At least one of companies_id, users_id, or challenges_id is required"
      );
    }
    if (
      (req.body.companies_id && req.body.users_id) ||
      (req.body.companies_id && req.body.challenges_id) ||
      (req.body.users_id && req.body.challenges_id)
    ) {
      throw new Error(
        "Only one of companies_id, users_id, or challenges_id can be provided"
      );
    }
    return true;
  }),
];
