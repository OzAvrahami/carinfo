import { searchRecords } from "./data-gov.js";

const RESOURCE_IDS = {
    registry: "053cea08-09bc-40ec-8f7a-156f0677aff3",
    history: "56063a99-8a3e-4ff4-912e-5966c0279bad",
    ownership: "bb2355dc-9ec7-4f06-9c3f-3344672171da",
    specifications: "142afde2-6228-49f9-8a29-9b6c3a0cbe40",

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

export async function getVehicleSpecifications(vehicle) {
    if (!vehicle || typeof vehicle !== "object" || Array.isArray(vehicle)) {
        throw new Error("A vehicle record is required to look up specification.");
    }

    const filters = {
        tozeret_cd: vehicle.tozeret_cd,
        degem_cd: vehicle.degem_cd,
        shnat_yitzur: vehicle.shnat_yitzur,
        sug_degem: vehicle.sug_degem,
    };

    // Prevent a lookup with missing model identifiers.
    if (
        Object.values(filters).some(
            (value) => value == null || String(value).trim() === ""
        )
    ) {
        throw new Error("Vehicle registry returned incomplete model identifiers.")
    }
    
    const { records }= await searchRecords({
        resourceId: RESOURCE_IDS.specifications,
        filters,
        limit: 2,
    });

    if (records.length === 0) {
        return null;
    }

    if (records.length > 1) {
        throw new Error("Data.gob returned multiple matching vehicle models.");
    }

    const specifications = records[0];

    // Verify that the returned record matches the requested identifiers.
    if (
        !specifications ||
        typeof specifications !== "object" ||
        Array.isArray(specifications) ||
        Object.entries(filters).some(
            ([field, value]) => String(specifications[field]) !== String(value)
        )
    ) {
        throw new Error("Data.gov returned an unexpected vehicle model.");
    }

    // Compare model and trim names when both datasets provide them.
    for (const field of ["degem_nm", "ramat_gimur"]) {
        const expected = String(vehicle[field] ?? "").trim().toUpperCase();
        const actual = String(specifications[field] ?? "").trim().toUpperCase();

        if (expected && actual && expected !== actual) {
            throw new Error("Vehicle model dose not match the registry: " + field + ".");
        };
    }

    return specifications;
}