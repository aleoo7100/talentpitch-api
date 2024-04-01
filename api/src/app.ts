import express, { Aplication } from "express";
import usersRoutes from "./routes/users.routes";
import companiesRoutes from "./routes/companies.routes";
import programsRoutes from "./routes/programs.routes";
import challengeRoutes from "./routes/challenges.routes";
import programParticipants from "./routes/programParticipants.routes";
import gptInteractionsRoutes from "./routes/gptInteractions.routes";
import morgan from "morgan";

const app: Aplication = express();

// env vars default config
process.env.PORT = process.env.PORT || "4000";
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

// routes
app.use(usersRoutes);
app.use(companiesRoutes);
app.use(programsRoutes);
app.use(challengeRoutes);
app.use(programParticipants);
app.use(gptInteractionsRoutes);

export default app;
