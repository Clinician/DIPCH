import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Only create client if both URL and key are provided
export const SUPABASE_ENABLED = !!(supabaseUrl && supabaseKey);
export const supabase = SUPABASE_ENABLED
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return SUPABASE_ENABLED;
}

// Helper function to create the necessary tables in Supabase
export async function setupSupabaseTables() {
  if (!SUPABASE_ENABLED || !supabase) return false;

  try {
    // This is just a check to see if we can connect
    const { data, error } = await supabase
      .from("procedures")
      .select("count", { count: "exact" });

    if (error) {
      console.error("Error connecting to Supabase:", error);
      return false;
    }

    console.log("Successfully connected to Supabase");
    return true;
  } catch (error) {
    console.error("Failed to setup Supabase tables:", error);
    return false;
  }
}

/*
SQL for setting up the Supabase tables:

-- Procedures table
CREATE TABLE procedures (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  surgeon TEXT NOT NULL,
  hospital TEXT NOT NULL,
  procedureType TEXT NOT NULL,
  location TEXT,
  side TEXT,
  notes TEXT,
  implants JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own procedures
CREATE POLICY "Users can read their own procedures" 
  ON procedures FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own procedures
CREATE POLICY "Users can insert their own procedures" 
  ON procedures FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own procedures
CREATE POLICY "Users can update their own procedures" 
  ON procedures FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own procedures
CREATE POLICY "Users can delete their own procedures" 
  ON procedures FOR DELETE 
  USING (auth.uid() = user_id);
*/
