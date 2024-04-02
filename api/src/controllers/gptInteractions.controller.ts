import prisma from "../helpers/prismaClient";
import { createCompletion } from "../helpers/openaiClient";
import { Request, Response } from "express";

export async function insertDummyData(req: Request, res: Response) {
  try {
    const jsonData = await createCompletion(prompt);
    const data = JSON.parse(jsonData);

    await prisma.users.createMany({ data: data.users });
    await prisma.challenges.createMany({ data: data.challenges });
    await prisma.companies.createMany({ data: data.companies });
    await prisma.programs.createMany({
      data: data.programs.map((program) => {
        return {
          ...program,
          start_date: new Date(program.start_date),
          end_date: new Date(program.end_date),
        };
      }),
    });

    await prisma.program_participants.createMany({
      data: data.program_participants,
    });

    res.json({
      ok: true,
      data: data,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}

const prompt = `
Genera datos dummy en formato JSON para una base de datos, los datos deben tener el siguiente formato:
{
  users: [ { users_id: "v4 uuid", email: "string", name: "string", image_path: "string" } ],
  challenges: [ { challenges_id: "v4 uuid", title: "string", description: "string", difficulty: int, users_id: "v4 uuid" } ],
  companies: [ { companies_id: "v4 uuid", name: "string", image_path: "string", location: "string", industry: "string", users_id: "v4 uuid" } ],
  programs: [ { programs_id: "v4 uuid", title: "string", description: "string", start_date: "dateTime", end_date: "dateTime", users_id: "v4 uuid" } ],
  program_participants: [ { programs_id: "v4 uuid", entity_type: "COMPANY|USER|CHALLENGE", users_id?: "v4 uuid", companies_id?: "v4 uuid", challenges_id?: "v4 uuid" } ]
} 
Incluye 5 usuarios.
Incluye 10 challenges.
incluye 5 compañías.
Incluye 5 programas.
Los programas pueden tener distintos tipos de participantes (usuarios, compañías o challenges) que se asocian con su respectivo id.
Con el entity_type define a qué tipo de entidad pertenece el participante.
Incluye 5 participantes de programas (program_participants), esos participantes deben ser: 2 compañías, 2 usuarios y 1 challenge (de los que ya creaste).
Asegúrate de cumplir con lo siguiente:
Que los correos, nombre y descripciones sean aleatorios.
En los correos incluye un timestamp para evitar duplicados.
Y que las relaciones entre modelos sean coherentes 
(por ejemplo, el users_id debe coincidir en los modelos relacionados).
`;
