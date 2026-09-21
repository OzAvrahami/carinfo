import express from "express";
import { fileURLToPath } from "node:url";

import vehicleRoutes from "./routes/vehiclesRoutes.js";

const app = express();

app.use("/api/vehicles", vehicleRoutes);

const clientDistPath = fileURLToPath(
    new URL("../../client/dist/", import.meta.url)
);

app.use(express.static(clientDistPath));

export default app;