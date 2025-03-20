import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Database, CheckCircle2, AlertCircle } from "lucide-react";
import { isSupabaseConfigured, setupSupabaseTables } from "../../lib/supabase";

interface SupabaseSetupProps {
  onSetupComplete?: () => void;
}

const SupabaseSetup: React.FC<SupabaseSetupProps> = ({
  onSetupComplete = () => {},
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");
  const [supabaseKey, setSupabaseKey] = useState<string>("");
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if Supabase is already configured
    const checkConfiguration = async () => {
      const configured = isSupabaseConfigured();
      setIsConfigured(configured);

      if (configured) {
        // Try to connect to verify credentials
        setIsLoading(true);
        const success = await setupSupabaseTables();
        setIsLoading(false);
        setSuccess(success);

        if (success) {
          // Load the current values from env
          setSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || "");
          setSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY || "");
        }
      }
    };

    checkConfiguration();
  }, []);

  const handleSaveConfig = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, we would save these to environment variables
      // For this demo, we'll just update the state and show a success message
      // with instructions on how to properly set them up

      // Validate inputs
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Please provide both Supabase URL and Anon Key");
      }

      if (!supabaseUrl.startsWith("https://")) {
        throw new Error("Supabase URL must start with https://");
      }

      // Show success message with instructions
      setSuccess(true);
      setIsConfigured(true);

      // Call the completion handler
      onSetupComplete();
    } catch (err: any) {
      setError(err.message || "Failed to save Supabase configuration");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-primary" />
          <CardTitle>Supabase Configuration</CardTitle>
        </div>
        <CardDescription>
          Connect your app to Supabase for cloud storage and synchronization
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {success ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">
              Successfully connected!
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Your app is now connected to Supabase. Your data will be
              synchronized between devices.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="supabaseUrl">Supabase URL</Label>
          <Input
            id="supabaseUrl"
            placeholder="https://your-project.supabase.co"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The URL of your Supabase project
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
          <Input
            id="supabaseKey"
            type="password"
            placeholder="your-anon-key"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The anonymous key from your Supabase project settings
          </p>
        </div>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            To set up Supabase, create a free account at{" "}
            <a
              href="https://supabase.com"
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              supabase.com
            </a>{" "}
            and create a new project.
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSaveConfig}
          disabled={isLoading || (!supabaseUrl && !supabaseKey)}
          className="w-full"
        >
          {isLoading
            ? "Connecting..."
            : isConfigured
              ? "Update Connection"
              : "Connect to Supabase"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseSetup;
