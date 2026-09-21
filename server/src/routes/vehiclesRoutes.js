import { Router } from "express";
import { getVehicleByPlate, getVehicleHistoryByPlate, getOwnershipHistoryByPlate, getVehicleSpecifications, InvalidPlateError } from "../integrations/vehicles.js";

const router = Router();

router.get("/:plateNumber", async (req, res) => {

    const vehicle = await getVehicleByPlate(req.params.plateNumber);
    
    if (vehicle === null) {
        return res.status(404).json({
            error: "Vehicle not found in the registry.",
        });
    }

    return res.json({ data: vehicle });
});

router.get("/:plateNumber/history", async (req, res) => {

    const history = await getVehicleHistoryByPlate(req.params.plateNumber);

    if (history === null) {
        return res.status(404).json({
            error: "Vehicle history not found in this dataset.",
        });
    }
    
    return res.json({ data: history });
});

router.get("/:plateNumber/ownershipHistory", async (req, res) => {

    const ownershipHistory = await getOwnershipHistoryByPlate(req.params.plateNumber);

    if (ownershipHistory.length === 0) {
        return res.status(404).json({
            error: "Ownership history not found in this dataset.",
        });
    }

    return res.json({ data: ownershipHistory });
});

router.get("/:plateNumber/report", async (req, res) => {
    
    const { plateNumber } = req.params;

    const [vehicle, history, ownershipHistory] = await Promise.all([
        getVehicleByPlate(plateNumber),
        getVehicleHistoryByPlate(plateNumber),
        getOwnershipHistoryByPlate(plateNumber),
    ]);
    
    if (vehicle === null) {
        return res.status(404).json({
            error: "Vehicle not found in the registry.",
        });
    }

    const specifications = await getVehicleSpecifications(vehicle);

    return res.json({
        data: {
            vehicle,
            history,
            ownershipHistory,
            specifications,
        },
    });
});

router.use((error, req, res, next) => {
    if (res.res.headersSent) {
        return next(error);
    }

    if (error instanceof InvalidPlateError) {
        return res.status(400).json({ error: error.message });
    }

    console.error("Vehicle data request failed:", error);

    if (error.name === "TimeoutError") {
        return res.status(504).json({
            error: "Data.gov did not respond in time.",
        });
    }

    return res.status(502).json({
        error: "Unable to retrieve vehicle data from Data.gov.",
    });
})

export default router;

