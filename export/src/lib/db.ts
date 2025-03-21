import { openDB, DBSchema, IDBPDatabase } from "idb";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Only create client if both URL and key are provided
const SUPABASE_ENABLED = !!(supabaseUrl && supabaseKey);
const supabase = SUPABASE_ENABLED
  ? createClient(supabaseUrl, supabaseKey)
  : null;

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

interface ImplantPassDB extends DBSchema {
  procedures: {
    key: string;
    value: ProcedureData;
    indexes: { "by-date": string };
  };
  settings: {
    key: string;
    value: any;
  };
}

let db: IDBPDatabase<ImplantPassDB>;

export async function initDB() {
  db = await openDB<ImplantPassDB>("implant-pass-db", 1, {
    upgrade(db) {
      // Create a store of procedures
      const procedureStore = db.createObjectStore("procedures", {
        keyPath: "id",
      });
      // Create an index on the date property
      procedureStore.createIndex("by-date", "date");

      // Create a store for app settings
      db.createObjectStore("settings", {
        keyPath: "id",
      });
    },
  });

  return db;
}

// Procedures CRUD operations
export async function getAllProcedures(): Promise<ProcedureData[]> {
  try {
    // Try Supabase first if enabled
    if (SUPABASE_ENABLED && supabase) {
      try {
        const { data, error } = await supabase
          .from("procedures")
          .select("*")
          .order("date", { ascending: false });

        if (error) {
          console.error("Supabase error fetching procedures:", error);
          // Fall back to IndexedDB
        } else if (data && data.length > 0) {
          console.log("Procedures fetched from Supabase:", data);
          return data as ProcedureData[];
        }
      } catch (err) {
        console.error("Error accessing Supabase:", err);
        // Fall back to IndexedDB
      }
    }

    // Fall back to IndexedDB
    if (!db) await initDB();
    return db.getAll("procedures");
  } catch (error) {
    console.error("Error fetching procedures:", error);
    // Always ensure we return something
    if (!db) await initDB();
    return db.getAll("procedures");
  }
}

export async function getProcedureById(
  id: string,
): Promise<ProcedureData | undefined> {
  try {
    if (!id) {
      console.error("Invalid procedure ID: ID is undefined or empty");
      return undefined;
    }

    // Try Supabase first if enabled
    if (SUPABASE_ENABLED && supabase) {
      try {
        const { data, error } = await supabase
          .from("procedures")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error(`Supabase error fetching procedure ${id}:`, error);
          // Fall back to IndexedDB
        } else if (data) {
          console.log(`Retrieved procedure ${id} from Supabase:`, data);
          return data as ProcedureData;
        }
      } catch (err) {
        console.error(`Error accessing Supabase for procedure ${id}:`, err);
        // Fall back to IndexedDB
      }
    }

    // Fall back to IndexedDB
    if (!db) await initDB();
    const procedure = await db.get("procedures", id);

    if (procedure) {
      console.log(`Retrieved procedure ${id} from IndexedDB:`, procedure);
    } else {
      console.log(`No procedure found with ID ${id}`);
    }

    return procedure;
  } catch (error) {
    console.error("Error getting procedure by ID:", error);
    throw error;
  }
}

export async function addProcedure(procedure: ProcedureData): Promise<string> {
  try {
    // Ensure the procedure has an ID
    if (!procedure.id) {
      procedure.id = `proc-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    // Ensure implants is an array before mapping
    if (!procedure.implants) {
      procedure.implants = [];
    }

    // Ensure each implant has an ID and remove serialNumber
    procedure.implants = procedure.implants.map((implant: any) => {
      const { serialNumber, ...rest } = implant;
      return {
        ...rest,
        id:
          implant.id || `imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        // If serialNumber exists and lotNumber is empty, use serialNumber as lotNumber
        lotNumber: implant.lotNumber || serialNumber || "",
      };
    });

    // Try to add to Supabase if enabled
    if (SUPABASE_ENABLED && supabase) {
      try {
        const { data, error } = await supabase
          .from("procedures")
          .insert(procedure)
          .select();

        if (error) {
          console.error("Supabase error adding procedure:", error);
          // Fall back to IndexedDB
        } else {
          console.log("Procedure added to Supabase:", data);
          return procedure.id;
        }
      } catch (err) {
        console.error("Error accessing Supabase for adding procedure:", err);
        // Fall back to IndexedDB
      }
    }

    // Fall back to IndexedDB
    if (!db) await initDB();
    await db.add("procedures", procedure);
    console.log("Procedure added to IndexedDB:", procedure);
    return procedure.id;
  } catch (error) {
    console.error("Error adding procedure:", error);
    throw error;
  }
}

export async function updateProcedure(
  procedure: ProcedureData,
): Promise<string> {
  try {
    // Validate procedure ID
    if (!procedure.id) {
      throw new Error("Cannot update procedure: Missing procedure ID");
    }

    // Ensure implants is an array before mapping
    if (!procedure.implants) {
      procedure.implants = [];
    }

    // Ensure each implant has an ID and remove serialNumber
    procedure.implants = procedure.implants.map((implant: any) => {
      const { serialNumber, ...rest } = implant;
      return {
        ...rest,
        id:
          implant.id || `imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        // If serialNumber exists and lotNumber is empty, use serialNumber as lotNumber
        lotNumber: implant.lotNumber || serialNumber || "",
      };
    });

    // Try to update in Supabase if enabled
    if (SUPABASE_ENABLED && supabase) {
      try {
        const { data, error } = await supabase
          .from("procedures")
          .update(procedure)
          .eq("id", procedure.id)
          .select();

        if (error) {
          console.error("Supabase error updating procedure:", error);
          // Fall back to IndexedDB
        } else {
          console.log("Procedure updated in Supabase:", data);
          return procedure.id;
        }
      } catch (err) {
        console.error("Error accessing Supabase for updating procedure:", err);
        // Fall back to IndexedDB
      }
    }

    // Fall back to IndexedDB
    if (!db) await initDB();
    // Update the procedure directly without checking if it exists first
    // This avoids the potential IDBObjectStore error
    await db.put("procedures", procedure);
    console.log("Procedure updated in IndexedDB:", procedure);
    return procedure.id;
  } catch (error) {
    console.error("Error updating procedure:", error);
    throw error;
  }
}

export async function deleteProcedure(id: string): Promise<void> {
  if (!id) {
    console.error("Cannot delete procedure: Missing procedure ID");
    return;
  }

  // Try to delete from Supabase if enabled
  if (SUPABASE_ENABLED && supabase) {
    try {
      const { error } = await supabase.from("procedures").delete().eq("id", id);

      if (error) {
        console.error("Supabase error deleting procedure:", error);
        // Fall back to IndexedDB
      } else {
        console.log(`Procedure ${id} deleted from Supabase`);
      }
    } catch (err) {
      console.error("Error accessing Supabase for deleting procedure:", err);
      // Fall back to IndexedDB
    }
  }

  // Also delete from IndexedDB to ensure consistency
  if (!db) await initDB();
  await db.delete("procedures", id);
  console.log(`Procedure ${id} deleted from IndexedDB`);
}

// Settings operations
export async function getSetting(id: string): Promise<any> {
  if (!db) await initDB();
  if (!id) {
    console.error("Cannot get setting: Missing setting ID");
    return null;
  }
  return db.get("settings", id);
}

export async function saveSetting(id: string, value: any): Promise<void> {
  if (!db) await initDB();
  if (!id) {
    console.error("Cannot save setting: Missing setting ID");
    return;
  }
  await db.put("settings", { id, value });
}
