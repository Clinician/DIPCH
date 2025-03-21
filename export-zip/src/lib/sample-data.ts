import { addProcedure } from "./db";

export interface ImplantData {
  id: string;
  name: string;
  manufacturer: string;
  serialNumber: string;
  type: string;
  location?: string;
  notes?: string;
  implantDate?: string;
}

export interface ProcedureData {
  id: string;
  date: string;
  surgeon: string;
  hospital: string;
  procedureType: string;
  notes?: string;
  implants: ImplantData[];
}

export const sampleProcedures: ProcedureData[] = [
  {
    id: "proc-1",
    date: "2023-05-15",
    surgeon: "Dr. Sarah Johnson",
    hospital: "University Medical Center",
    procedureType: "Total Hip Replacement",
    notes: "Successful procedure with no complications",
    implants: [
      {
        id: "imp-1",
        name: "Zimmer Biomet Taperloc Hip Stem",
        manufacturer: "Zimmer Biomet",
        serialNumber: "ZB-TL-12345",
        type: "Hip Stem",
        location: "Left Hip",
        implantDate: "2023-05-15",
        notes: "Size 12, Standard Offset",
      },
      {
        id: "imp-2",
        name: "Zimmer Biomet Continuum Acetabular Cup",
        manufacturer: "Zimmer Biomet",
        serialNumber: "ZB-AC-67890",
        type: "Acetabular Cup",
        location: "Left Hip",
        implantDate: "2023-05-15",
        notes: "Size 54mm",
      },
    ],
  },
  {
    id: "proc-2",
    date: "2022-11-03",
    surgeon: "Dr. Michael Chen",
    hospital: "Memorial Hospital",
    procedureType: "Cardiac Pacemaker Implantation",
    notes: "Dual chamber pacemaker implanted due to symptomatic bradycardia",
    implants: [
      {
        id: "imp-3",
        name: "Medtronic Advisa MRI SureScan",
        manufacturer: "Medtronic",
        serialNumber: "MDT-PM-54321",
        type: "Cardiac Pacemaker",
        location: "Left Pectoral Region",
        implantDate: "2022-11-03",
        notes: "Dual chamber, MRI compatible",
      },
    ],
  },
  {
    id: "proc-3",
    date: "2023-09-22",
    surgeon: "Dr. Emily Rodriguez",
    hospital: "Orthopedic Specialty Center",
    procedureType: "ACL Reconstruction",
    notes:
      "Arthroscopic ACL reconstruction using autograft from patellar tendon",
    implants: [
      {
        id: "imp-4",
        name: "Smith & Nephew Endobutton CL Ultra",
        manufacturer: "Smith & Nephew",
        serialNumber: "SN-EB-11223",
        type: "Fixation Device",
        location: "Right Knee",
        implantDate: "2023-09-22",
        notes: "15mm loop length",
      },
      {
        id: "imp-5",
        name: "Arthrex BioComposite Interference Screw",
        manufacturer: "Arthrex",
        serialNumber: "AX-IS-44556",
        type: "Interference Screw",
        location: "Right Knee",
        implantDate: "2023-09-22",
        notes: "9mm x 28mm",
      },
    ],
  },
];

export async function loadSampleData() {
  try {
    console.log("Loading sample data...");
    for (const procedure of sampleProcedures) {
      await addProcedure(procedure);
    }
    console.log("Sample data loaded successfully");
    return true;
  } catch (error) {
    console.error("Error loading sample data:", error);
    return false;
  }
}
