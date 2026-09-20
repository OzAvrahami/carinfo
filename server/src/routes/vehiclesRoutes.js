import { Router } from "express";
import { getVehicleByPlate, InvalidPlateError } from "../integrations/vehicles.js";

const router = Router();

router.get("/:plateNumber", async (req, res) => {
    try {
        const vehicle = await getVehicleByPlate(req.params.plateNumber);

        if (vehicle === null) {
            return res.status(404).json({
                error: "Vehicle not found in the registry.",
            });
        }

        return res.json({ data: vehicle });
    } catch (error) {
        if (error instanceof InvalidPlateError) {
            return res.status(400).json({ error: error.message });
        }

        console.error("Vehicle lookup failed:", error);

        if (error.name === "TimeoutError") {
            return res.status(504).json({
                error: "Data.gov did not respond in time.",
            });
        }

        return res.status(502).json({
            error: "Unable to retrieve vehicle data from Data.gov.",
        });
    }
});

export default router;

