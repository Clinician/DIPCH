import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  initDB,
  getAllProcedures,
  addProcedure as dbAddProcedure,
  updateProcedure as dbUpdateProcedure,
  deleteProcedure as dbDeleteProcedure,
  getProcedureById as dbGetProcedureById,
} from "../lib/db";

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
  location?: string;
  side?: string;
  notes?: string;
  implants: ImplantData[];
}

interface ProcedureContextType {
  procedures: ProcedureData[];
  loading: boolean;
  addProcedure: (procedure: ProcedureData) => Promise<string>;
  updateProcedure: (
    id: string,
    updatedProcedure: ProcedureData,
  ) => Promise<string>;
  deleteProcedure: (id: string) => Promise<void>;
  getProcedureById: (id: string) => Promise<ProcedureData | undefined>;
  refreshProcedures: () => Promise<void>;
}

const ProcedureContext = createContext<ProcedureContextType | undefined>(
  undefined,
);

export const useProcedures = () => {
  const context = useContext(ProcedureContext);
  if (!context) {
    throw new Error("useProcedures must be used within a ProcedureProvider");
  }
  return context;
};

interface ProcedureProviderProps {
  children: ReactNode;
}

// Sample initial data for development
const sampleProcedures: ProcedureData[] = [
  {
    id: "1",
    date: "2023-05-15",
    hospital: "Memorial Hospital",
    surgeon: "Dr. Jane Smith",
    procedureType: "Hip Replacement",
    location: "Hip",
    side: "Left",
    notes: "Successful procedure with no complications",
    implants: [
      {
        id: "imp1",
        name: "Titanium Hip Implant",
        manufacturer: "MedTech Solutions",
        serialNumber: "TH-12345-A",
        type: "Hip Prosthesis",
      },
      {
        id: "imp2",
        name: "Ceramic Femoral Head",
        manufacturer: "OrthoMed",
        serialNumber: "CF-98765-B",
        type: "Femoral Component",
      },
    ],
  },
  {
    id: "2",
    date: "2023-07-22",
    hospital: "City General Hospital",
    surgeon: "Dr. Robert Johnson",
    procedureType: "Knee Replacement",
    location: "Knee",
    side: "Right",
    notes: "Patient recovering well",
    implants: [
      {
        id: "imp3",
        name: "Cobalt-Chrome Knee System",
        manufacturer: "JointPro",
        serialNumber: "KS-54321-C",
        type: "Total Knee Replacement",
      },
    ],
  },
  {
    id: "3",
    date: "2023-09-10",
    hospital: "University Medical Center",
    surgeon: "Dr. Sarah Williams",
    procedureType: "Spinal Fusion",
    location: "Lumbar Spine",
    notes: "Patient recovery progressing well",
    implants: [
      {
        id: "imp4",
        name: "Titanium Spinal Rod",
        manufacturer: "SpineTech",
        serialNumber: "SR-67890-D",
        type: "Spinal Fixation",
      },
      {
        id: "imp5",
        name: "Interbody Fusion Cage",
        manufacturer: "SpineTech",
        serialNumber: "IF-13579-E",
        type: "Interbody Device",
      },
    ],
  },
];

export const ProcedureProvider: React.FC<ProcedureProviderProps> = ({
  children,
}) => {
  const [procedures, setProcedures] = useState<ProcedureData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize database and load procedures
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB();
        await refreshProcedures();
      } catch (error) {
        console.error("Failed to initialize database:", error);
        // Fallback to sample data if database initialization fails
        setProcedures(sampleProcedures);
      } finally {
        setLoading(false);
      }
    };

    initializeDB();
  }, []);

  // Refresh procedures from database
  const refreshProcedures = async () => {
    try {
      setLoading(true);
      const allProcedures = await getAllProcedures();

      // If no procedures in database, seed with sample data
      if (allProcedures.length === 0) {
        for (const procedure of sampleProcedures) {
          await dbAddProcedure(procedure);
        }
        setProcedures(sampleProcedures);
      } else {
        setProcedures(allProcedures);
      }
    } catch (error) {
      console.error("Failed to refresh procedures:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new procedure
  const addProcedure = async (procedure: ProcedureData) => {
    try {
      const newProcedure = {
        ...procedure,
        id: procedure.id || `proc-${Date.now()}`,
        implants:
          procedure.implants?.map((implant) => ({
            ...implant,
            id:
              implant.id ||
              `imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          })) || [],
      };

      await dbAddProcedure(newProcedure);
      setProcedures([...procedures, newProcedure]);
      return newProcedure.id;
    } catch (error) {
      console.error("Failed to add procedure:", error);
      throw error;
    }
  };

  // Update an existing procedure
  const updateProcedure = async (
    id: string,
    updatedProcedure: ProcedureData,
  ) => {
    try {
      const procedureToUpdate = { ...updatedProcedure, id };
      await dbUpdateProcedure(procedureToUpdate);

      setProcedures(
        procedures.map((procedure) =>
          procedure.id === id ? procedureToUpdate : procedure,
        ),
      );

      return id;
    } catch (error) {
      console.error("Failed to update procedure:", error);
      throw error;
    }
  };

  // Delete a procedure
  const deleteProcedure = async (id: string) => {
    try {
      await dbDeleteProcedure(id);
      setProcedures(procedures.filter((procedure) => procedure.id !== id));
    } catch (error) {
      console.error("Failed to delete procedure:", error);
      throw error;
    }
  };

  // Get a procedure by ID
  const getProcedureById = async (id: string) => {
    try {
      console.log("Getting procedure by ID:", id);
      const dbProcedure = await dbGetProcedureById(id);
      if (dbProcedure) {
        console.log("Found procedure in DB:", dbProcedure);
        return dbProcedure;
      }

      // Fallback to in-memory data if not found in database
      console.log("Procedure not found in DB, checking in-memory data");
      const memoryProcedure = procedures.find(
        (procedure) => procedure.id === id,
      );
      console.log("Found in memory?", memoryProcedure);
      return memoryProcedure;
    } catch (error) {
      console.error("Failed to get procedure by ID:", error);
      // Fallback to in-memory data if database query fails
      const fallbackProcedure = procedures.find(
        (procedure) => procedure.id === id,
      );
      console.log("Fallback procedure:", fallbackProcedure);
      return fallbackProcedure;
    }
  };

  return (
    <ProcedureContext.Provider
      value={{
        procedures,
        loading,
        addProcedure,
        updateProcedure,
        deleteProcedure,
        getProcedureById,
        refreshProcedures,
      }}
    >
      {children}
    </ProcedureContext.Provider>
  );
};
