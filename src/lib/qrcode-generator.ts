import QRCode from "qrcode";
import { ProcedureData } from "../context/ProcedureContext";

// Generate a sample hip replacement procedure with multiple implants
export function generateHipReplacementQRCode(): Promise<string> {
  const sampleProcedure: ProcedureData = {
    id: `proc-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    surgeon: "Dr. Sarah Johnson",
    hospital: "University Hospital Zurich",
    procedureType: "Total Hip Replacement",
    notes:
      "Successful procedure with excellent initial recovery. Patient mobilized on day 1 post-op.",
    implants: [
      {
        id: `imp-${Date.now()}-1`,
        name: "Acetabular Cup",
        manufacturer: "Zimmer Biomet",
        serialNumber: "ZB-AC-23456",
        type: "Titanium Alloy with Trabecular Metal",
        location: "Right Hip",
        implantDate: new Date().toISOString().split("T")[0],
        notes: "Size 54mm, press-fit",
      },
      {
        id: `imp-${Date.now()}-2`,
        name: "Acetabular Liner",
        manufacturer: "Zimmer Biomet",
        serialNumber: "ZB-AL-34567",
        type: "Highly Cross-linked Polyethylene",
        location: "Right Hip",
        implantDate: new Date().toISOString().split("T")[0],
        notes: "Size 54/32mm",
      },
      {
        id: `imp-${Date.now()}-3`,
        name: "Femoral Head",
        manufacturer: "Zimmer Biomet",
        serialNumber: "ZB-FH-45678",
        type: "Ceramic (Biolox Delta)",
        location: "Right Hip",
        implantDate: new Date().toISOString().split("T")[0],
        notes: "Size 32mm +0 offset",
      },
      {
        id: `imp-${Date.now()}-4`,
        name: "Femoral Stem",
        manufacturer: "Zimmer Biomet",
        serialNumber: "ZB-FS-56789",
        type: "Titanium Alloy",
        location: "Right Hip",
        implantDate: new Date().toISOString().split("T")[0],
        notes: "Size 6, standard offset, uncemented",
      },
    ],
  };

  // Convert procedure data to JSON string
  const procedureJSON = JSON.stringify(sampleProcedure);

  // Generate QR code as data URL
  return QRCode.toDataURL(procedureJSON, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 300,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}

// QR Code Structure Documentation
export const qrCodeStructureDoc = `
# QR Code Structure for Implant Pass

The QR codes used by Implant Pass contain JSON data with the following structure:

## Single Procedure QR Code

\`\`\`json
{
  "id": "unique-procedure-id",
  "date": "YYYY-MM-DD",
  "surgeon": "Surgeon Name",
  "hospital": "Hospital Name",
  "procedureType": "Type of Procedure",
  "notes": "Optional procedure notes",
  "implants": [
    {
      "id": "unique-implant-id",
      "name": "Implant Name",
      "manufacturer": "Manufacturer Name",
      "serialNumber": "Serial Number",
      "type": "Implant Type",
      "location": "Anatomical Location",
      "notes": "Optional implant notes",
      "implantDate": "YYYY-MM-DD"
    },
    // Additional implants...
  ]
}
\`\`\`

## Multiple Procedures QR Code

For QR codes containing multiple procedures, the structure is an array of procedure objects:

\`\`\`json
[
  {
    // Procedure 1 (structure as above)
  },
  {
    // Procedure 2 (structure as above)
  },
  // Additional procedures...
]
\`\`\`

## Notes

- All dates should be in ISO format (YYYY-MM-DD)
- IDs should be unique strings
- The QR code should be generated with high error correction level
- Maximum data capacity depends on QR code version and error correction level
`;
