import QRCode from "qrcode";
import { formatDateString } from "./utils";

interface ImplantData {
  id: string;
  name: string;
  manufacturer: string;
  articleNumber: string;
  lotNumber: string;
  type: string;
  location?: string;
  notes?: string;
  implantDate?: string;
}

interface ProcedureData {
  id: string;
  date: string;
  surgeon: string;
  hospital: string;
  procedureType: string;
  notes?: string;
  implants: ImplantData[];
}

// Generate QR code for a procedure
export async function generateProcedureQRCode(
  procedure: ProcedureData,
): Promise<string> {
  try {
    // Ensure date is in DD.MM.YYYY format
    const formattedProcedure = {
      ...procedure,
      date: formatDateString(procedure.date),
      implants: procedure.implants.map((implant) => ({
        ...implant,
        implantDate: implant.implantDate
          ? formatDateString(implant.implantDate)
          : undefined,
      })),
    };

    // Add documentation about the date format
    const qrCodeData = {
      formatVersion: "1.0",
      dateFormat: "DD.MM.YYYY",
      procedure: formattedProcedure,
    };

    // Convert procedure data to JSON string
    const procedureJSON = JSON.stringify(qrCodeData);

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(procedureJSON, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 300,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    // Return a fallback QR code with error message
    const fallbackQR = await QRCode.toDataURL("Error generating QR code", {
      errorCorrectionLevel: "L",
      margin: 1,
      width: 300,
    });
    return fallbackQR;
  }
}

// Generate QR code for all procedures
export async function generateAllProceduresQRCode(
  procedures: ProcedureData[],
): Promise<string> {
  try {
    if (!procedures || procedures.length === 0) {
      throw new Error("No procedures available to generate QR code");
    }

    // Format dates to DD.MM.YYYY before generating QR code
    const formattedProcedures = procedures.map((procedure) => ({
      ...procedure,
      date: formatDateString(procedure.date),
      implants: procedure.implants.map((implant) => ({
        ...implant,
        implantDate: implant.implantDate
          ? formatDateString(implant.implantDate)
          : undefined,
      })),
    }));

    // Create a structured data object with metadata
    const qrCodeData = {
      formatVersion: "1.0",
      dateFormat: "DD.MM.YYYY",
      type: "allProcedures",
      count: procedures.length,
      procedures: formattedProcedures,
      generatedAt: new Date().toISOString(),
      appName: "Implant Pass",
    };

    // Convert all procedures data to JSON string
    const proceduresJSON = JSON.stringify(qrCodeData);

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(proceduresJSON, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 400, // Larger size for more data
      scale: 4, // Higher scale for better resolution
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    // Return a fallback QR code with error message
    const fallbackQR = await QRCode.toDataURL("Error generating QR code", {
      errorCorrectionLevel: "L",
      margin: 1,
      width: 300,
    });
    return fallbackQR;
  }
}

// Parse QR code data
export function parseProcedureQRCode(
  data: string,
): ProcedureData | ProcedureData[] | null {
  try {
    const parsedData = JSON.parse(data);

    // Handle the new structured format with metadata
    if (parsedData.formatVersion && parsedData.dateFormat) {
      if (
        parsedData.type === "allProcedures" &&
        Array.isArray(parsedData.procedures)
      ) {
        return parsedData.procedures as ProcedureData[];
      } else if (parsedData.procedure) {
        return parsedData.procedure as ProcedureData;
      }
    }

    // Fallback for legacy format
    if (Array.isArray(parsedData)) {
      return parsedData as ProcedureData[];
    } else if (parsedData.id && parsedData.date) {
      return parsedData as ProcedureData;
    }

    console.error("Unknown QR code data format");
    return null;
  } catch (error) {
    console.error("Error parsing QR code data:", error);
    return null;
  }
}

// Generate a sample QR code for testing
export function generateSampleProcedureQRCode(): ProcedureData {
  const sampleProcedure: ProcedureData = {
    id: `sample-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    surgeon: "Dr. Jane Smith",
    hospital: "General Hospital",
    procedureType: "Total Hip Replacement",
    location: "Hip",
    side: "Right",
    notes: "Patient recovered well with no complications.",
    implants: [
      {
        id: `imp-${Date.now()}-1`,
        name: "Acetabular Cup",
        manufacturer: "Zimmer Biomet",
        articleNumber: "ART-12345",
        lotNumber: "LOT-AC-12345",
        type: "Titanium Alloy",
        implantDate: new Date().toISOString().split("T")[0],
        notes: "Size 52mm",
      },
      {
        id: `imp-${Date.now()}-2`,
        name: "Femoral Head",
        manufacturer: "Zimmer Biomet",
        articleNumber: "ART-67890",
        lotNumber: "LOT-FH-67890",
        type: "Ceramic",
        implantDate: new Date().toISOString().split("T")[0],
        notes: "Size 32mm",
      },
      {
        id: `imp-${Date.now()}-3`,
        name: "Acetabular Liner",
        manufacturer: "Zimmer Biomet",
        articleNumber: "ART-24680",
        lotNumber: "LOT-AL-24680",
        type: "Polyethylene",
        implantDate: new Date().toISOString().split("T")[0],
        notes: "Highly cross-linked",
      },
      {
        id: `imp-${Date.now()}-4`,
        name: "Femoral Stem",
        manufacturer: "Zimmer Biomet",
        articleNumber: "ART-13579",
        lotNumber: "LOT-FS-13579",
        type: "Titanium Alloy",
        implantDate: new Date().toISOString().split("T")[0],
        notes: "Size 5, uncemented",
      },
    ],
  };

  return sampleProcedure;
}
