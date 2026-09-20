import express from "express";
import vehicleRoutes from "./routes/vehiclesRoutes.js";

const app = express();

app.use("/api/vehicles", vehicleRoutes);

export default app;