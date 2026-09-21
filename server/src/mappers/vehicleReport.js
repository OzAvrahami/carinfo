const MISSING = "לא נמסר";

const numberFormatter = new Intl.NumberFormat("he-IL", {
    maximumFractionDigits: 20,
});

function toText(value) {
    if (typeof value === "string") {
        return value.trim() || null;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }

    return null;
}

// Shared structure for every display field.
function field(
    label,
    value,
    text = value == null ? MISSING : String(value)
) {
    return {
        label,
        value,
        text,
        display: text,
        unit: "",
    };
}

function textField(label, raw) {
    return field(label, toText(raw))
}

function numberField(label, raw, unit = "") {
    const input = toText(raw);
    const parsed = input === null ? NaN : Number(input);
    const value = Number.isFinite(parsed) ? parsed : null;
    const text = value === null ? MISSING : numberFormatter.format(value);

    return {
        ...field(label, value, text),
        unit: value === null ? "" : unit,
        display: value !== null && unit ? `${text} ${unit}` : text,
    };
}

// Unknown indicators remain null instead of becoming false.
function flagField(label, raw) {
    const input = toText(raw);

    const value =
        raw === true || input === "1"
            ? true
            : raw === false || input === "0"
                ? false
                : null;

    const text = value === null ? MISSING : value ? "לא" : "כן";

    return field(label, value, text);
}

function yearField(raw) {
    const input = toText(raw);

    const value =
        /^\d{4}$/.test(input ?? "") && Number(input) >= 1000
        ? Number(input)
        : null;

    const text = value === null ? MISSING : String(value);

    return {
        ...field("שנת ייצור", value, text),
        shortText: value === null ? MISSING : text.slice(-2),
    };
}

function plateField(raw) {
    const input = toText(raw)?.replace(/[\s-]/g, "");
    const value = /^\d{7,8}$/.test(input ?? "") ? input : null;

    const text = 
        value === null
        ? MISSING
        : value.length === 8
            ? value.replace(/^(\d{3})(\d{2})(\d{2,3})$/, "$1-$2-$3")
            : value.replace(/^(\d{2})(\d{3})(\d{2,3})$/, "$1-$2-$3");

    return field("מספר רישוי", value, text);
}

// Preserve month precision and avoid timezone-related date shifts.
function dateField(label, raw, precision = "day") {
    let input = toText(raw);
    const monthOnly = precision === "month";

    // Ownership dates arrive as YYYYMM.
    if (monthOnly && /^\d{6}$/.test(input ?? "")) {
        input = `${input.slice(0, 4)}-${input.slice(4)}`;
    }

    const pattern = monthOnly
        ? /^(\d{4})-(\d{1,2})$/
        : /^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/;

    const match = input?.match(pattern);

    if (!match) {
        return field(label, null);
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = monthOnly ? 1 : Number(match[3])

    // Validate the calendar date without silently accepting rollover.
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        year < 1000 ||
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return field(label, null);
    }

    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    const value = monthOnly
        ? `${mm}/${year}`
        : `${dd}.${mm},${year}`;

    const text = monthOnly
        ? `${mm}/${year}`
        : `${dd}.${mm}.${year}`;

    return field(label, value, text);
}

function isRecord(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

// Receives the four integration results before display mapping.
// Missing history/specifications records are null.
// Ownership history is always an array.
export function mapVehicleReport({vehicle, history, ownershipHistory, specifications}) {
    if (
        !isRecord(vehicle) ||
        (history !== null && !isRecord(history)) ||
        (specifications !== null && !isRecord(specifications)) ||
        !Array.isArray(ownershipHistory) ||
        !ownershipHistory.every(isRecord)
    ) {
        throw new TypeError("Cannot map an unexpected vehicle report structure.");
    }

    return {
        vehicle: {
            plateNumber: plateField(vehicle.mispar_rechev),
            manufacturer: textField("יצרן", vehicle.tozeret_nm),
            model: textField("דגם", vehicle.kinuy_mishari),
            manufacturerYear: yearField(vehicle.shnat_yitzur),
            trimLevel: textField("רמת גימור", vehicle.ramat_gimur),
            fuelType: textField("סוג דלק", vehicle.sug_delek_nm),
            color: textField("צבע", vehicle.tzeva_rechev),

            currentOwnershipType: textField("בעלות נוכחית", vehicle.baalut),

            vin: textField("מספר שלדה", vehicle.misgeret),
            engineModel: textField("דגם מנוע", vehicle.degem_manoa),
            modelCode: textField("קוד דגם", vehicle.degem_cd),
            modelDesignation: textField("סימון דגם", vehicle.degem_nm),
            frontTireSize: textField("מידת צמיג קדמי", vehicle.zmig_kidmi),
            rearTireSize: textField("מידת צמיג אחורי", vehicle.zmig_ahori),
            firstRoadMonth: dateField("עלייה לכביש", vehicle.moed_aliya_lakvish, "month"),
            lastTestDate: dateField("תאריך טסט אחרון", vehicle.mivchan_acharon_dt),
            licenseValidUntil: dateField("תוקף רישיון הרכב", vehicle.tokef_dt),

            // Equipment level is not a crash-test rating.
            safetyEquipmentLevel: numberField("רמת אבזור בטיחותי", vehicle.ramat_eivzur_betihuty),
            pollutionGroup: numberField("קבוצת זיהום", vehicle.kvutzat_zihum),
        },

        history: {
            available: history !== null,
            
            engineNumber: textField("מספר מנוע", history?.mispar_manoa),

            // Last recorded test reading, not current mileage.
            lastTestMileageKm: numberField("קילומטראז׳", history?.kilometer_test_aharon, "ק״מ"),    // ק״מ בטסט האחרון
            firstRegistrationDate: dateField("תאריך רישום ראשון", history?.rishum_rishon_dt),
            originality: textField("מקוריות", history?.mkoriut_nm),

            // Reported modifications do not establish accident history.
            structureChanged: flagField("שינוי מבנה מדווח", history?.shinui_mivne_ind),
            lpgInstalled: flagField("התקנת גפ״מ מדווחת", history?.gapam_ind),
            colorChanged: flagField("שינוי צבע מדווח", history?.shnui_zeva_ind),
            tiresChanged: flagField("שינוי צמיגים מדווח", history?.shinui_zmig_ind),
        },
        
        specifications: {
            available: specifications !== null,
            bodyType: textField("סוג מרכב", specifications?.merkav),
            seatCount: numberField("מספר מושבים", specifications?.mispar_moshavim, "מושבים"),
            doorCount: numberField("מספר דלתות", specifications?.mispar_dlatot, "דלתות"),
            powerHp: numberField("הספק", specifications?.koah_sus, "כ״ס"),
            engineDisplacementCc: numberField("נפח מנוע", specifications?.nefah_manoa, "סמ״ק"),
            countryOfManufacture: textField("ארץ ייצור", specifications?.tozeret_eretz_nm),

            // 4X2 does not identify front-wheel or rear-wheel drive.
            driveConfiguration: textField("תצורת הנעה", specifications?.hanaa_nm),
            propulsionTechnology: textField("טכנולוגיית הנעה", specifications?.technologiat_hanaa_nm),

            // Total weight, not curb weight.
            grossWeightKg: numberField("משקל כולל", specifications?.mishkal_kolel, "ק״ג"),
            towingWithBrakesKg: numberField("כושר גרירה עם בלמים", specifications?.kosher_grira_im_blamim, "ק״ג"),
            towingWithoutBrakesKg: numberField("כושר גרירה בלי בלמים", specifications?.kosher_grira_bli_blamim, "ק״ג"),

            airbagCount: numberField("מספר כריות אוויר", specifications?.mispar_kariot_avir),
            safetyScore: numberField("ניקוד בטיחות", specifications?.nikud_betihut),
            automaticTransmission: flagField("תיבה אוטומטית", specifications?.automatic_ind),
            abs: flagField("מערכת ABS", specifications?.abs_ind),
            stabilityControl: flagField("בקרת יציבות", specifications?.bakarat_yatzivut_ind),
            adaptiveCruiseControl: flagField("בקרת שיוט אדפטיבית", specifications?.bakarat_shyut_adaptivit_ind),
            blindSpotDetection: flagField("זיהוי בשטח מת", specifications?.zihuy_beshetah_nistar_ind),
            reverseCamera: flagField("מצלמת רוורס", specifications?.matzlemat_reverse_ind),
            tirePressureMonitoring: flagField("חיישני לחץ אוויר בצמיגים", specifications?.hayshaney_lahatz_avir_batzmigim_ind),
            pedestrianDetection: flagField("זיהוי הולכי רגל", specifications?.zihuy_holchey_regel_ind),
            automaticHighBeams: flagField("שליטה אוטומטית באורות גבוהים", specifications?.shlita_automatit_beorot_gvohim_ind),
            trafficSignRecognition: flagField("זיהוי תמרורי תנועה", specifications?.zihuy_tamrurey_tnua_ind),
            reverseAutomaticBraking: flagField("בלימה אוטומטית בנסיעה לאחור", specifications?.blima_otomatit_nesia_leahor),
        },


        // Preserve all rows and the order established by the integration.
        ownershipHistory: ownershipHistory.map((record) => ({
            id: toText(record._id),

            startMonth: dateField("חודש תחילת בעלות", record.baalut_dt, "month"),

            ownershipType: textField("סוג בעלות", record.baalut),
        })),
        
        // Number of records, not number of previous owners.
        ownershipRecordCount: numberField("מספר בעלים", ownershipHistory.length),
    };
}