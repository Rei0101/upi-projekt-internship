import express from "express";
import cors from "cors";
import scheduleRoutes from "./routes/apiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", scheduleRoutes);

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

export { app, server };

