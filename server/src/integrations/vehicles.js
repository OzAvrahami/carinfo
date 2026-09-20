import { searchRecords } from "./data-gov.js";

const RESOURCE_IDS = {
    registry: "053cea08-09bc-40ec-8f7a-156f0677aff3",
    history: "56063a99-8a3e-4ff4-912e-5966c0279bad",
    ownership: "bb2355dc-9ec7-4f06-9c3f-3344672171da",
};

export class InvalidPlateError extends TypeError {
    constructor(message) {
        super(message);
        this.name = "InvalidPlateError";
    }
}

function normalizePlateNumber(plateNumber) {
    if (typeof plateNumber !== "string" && typeof plateNumber !== "number") {
        throw new InvalidPlateError("Plate number must be a string or a number");
    }

    const plate = typeof plateNumber === "string"
        ? plateNumber.replace(/[\s-]/g, "")
        : String(plateNumber);

    if (!/^\d{7,8}$/.test(plate)) {
        throw new InvalidPlateError("Plate number must contain 7 or 8 digits.");
    }

    return Number(plate);
}

async function findRecordsByPlate(resourceId, plateNumber, { allRecords = false, sort} = {},) {
    const numericPlate = normalizePlateNumber(plateNumber);
    const records = [];

    while (true) {
        const result = await searchRecords({
            resourceId,
            filters: { mispar_rechev: numericPlate },
            limit: allRecords ? 100 : 1,
            offset: records.length,
            sort,
        });

        // Verify every record before returning or collecting it.
        for (const record of result.records) {
            if (
                !record ||
                typeof record !== "object" ||
                Array.isArray(record) ||
                Number(record.mispar_rechev) !== numericPlate
            ) {
                throw new Error("Data.gov returned an unexpected vehicle record.");
            }
        }

        records.push(...result.records);

        // An estimated total must not stop pagination early.
        const totalReached = 
            Number.isSafeInteger(result.total) &&
            result.total >= 0 &&
            result.total_was_estimated !== true &&
            records.length >= result.total;

        if (!allRecords || result.records.length === 0 || totalReached) {
            return records;
        }
    }
}

export async function getVehicleByPlate(plateNumber) {
    const records = await findRecordsByPlate(RESOURCE_IDS.registry, plateNumber);
    return records[0] ?? null;
}

export async function getVehicleHistoryByPlate(plateNumber) {
    const records = await findRecordsByPlate(RESOURCE_IDS.history, plateNumber);
    return records[0] ?? null;
}

export async function getOwnershipHistoryByPlate(plateNumber) {
    return findRecordsByPlate(RESOURCE_IDS.ownership, plateNumber, {
        allRecords: true,
        sort: "baalut_dt asc, _id asc",
    });
}