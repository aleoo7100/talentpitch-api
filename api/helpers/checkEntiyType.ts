interface Body {
  companies_id?: string;
  users_id?: string;
  challenges_id?: string;
}

// check the entity type by checking the request body
export function checkEntityType(body: Body) {
  if (body.companies_id) return "COMPANY";
  else if (body.users_id) return "USER";
  else return "CHALLENGE";
}
