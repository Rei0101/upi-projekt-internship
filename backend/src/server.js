import express from "express";
import cors from "cors";
import generalRoutes from "./routes/generalRoutes.js";
import userRoutes from "./routes/korisnikRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// općenite API rute
app.use("/api", generalRoutes);

// user-specific rute
app.use("/api/korisnik", userRoutes);

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/api`);
});

export { app, server };
