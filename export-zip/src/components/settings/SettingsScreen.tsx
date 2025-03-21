import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ArrowLeft,
  Shield,
  Database,
  Bell,
  CloudUpload,
  KeyRound,
  Server,
  Globe,
} from "lucide-react";
import { Label } from "../ui/label";
import SupabaseSetup from "./SupabaseSetup";
import { isSupabaseConfigured } from "../../lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SettingsScreenProps {
  onBack?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack = () => {},
}) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("security");
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  // Security settings
  const [useFaceID, setUseFaceID] = useState(true);
  const [usePIN, setUsePIN] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState("5");

  // Integration settings
  const [enableFHIR, setEnableFHIR] = useState(false);
  const [enableOpenEHR, setEnableOpenEHR] = useState(false);

  // Backup settings
  const [autoBackup, setAutoBackup] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("weekly");

  // Notification settings
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);

  const handleBack = () => {
    navigate("/");
    onBack();
  };

  useEffect(() => {
    // Check if Supabase is configured
    setSupabaseConfigured(isSupabaseConfigured());
  }, []);

  const handleChangePIN = () => {
    // Navigate to PIN setup screen
    navigate("/pin-setup", { state: { returnToSettings: true } });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-background">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger
            value="security"
            className="flex items-center justify-center"
          >
            <Shield className="h-4 w-4 mr-2" />
            {t("settings.security")}
          </TabsTrigger>
          <TabsTrigger
            value="integration"
            className="flex items-center justify-center"
          >
            <Database className="h-4 w-4 mr-2" />
            {t("settings.integration")}
          </TabsTrigger>
          <TabsTrigger
            value="backup"
            className="flex items-center justify-center"
          >
            <CloudUpload className="h-4 w-4 mr-2" />
            {t("settings.backup")}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center justify-center"
          >
            <Bell className="h-4 w-4 mr-2" />
            {t("settings.notifications")}
          </TabsTrigger>
          <TabsTrigger
            value="cloud"
            className="flex items-center justify-center"
          >
            <Server className="h-4 w-4 mr-2" />
            {t("settings.cloud")}
          </TabsTrigger>
          <TabsTrigger
            value="language"
            className="flex items-center justify-center"
          >
            <Globe className="h-4 w-4 mr-2" />
            {t("settings.language")}
          </TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Configure how you access your implant data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Use Face ID</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable Face ID authentication
                  </p>
                </div>
                <Switch checked={useFaceID} onCheckedChange={setUseFaceID} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Use PIN Code</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable PIN code authentication
                  </p>
                </div>
                <Switch checked={usePIN} onCheckedChange={setUsePIN} />
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={handleChangePIN}
                  className="w-full flex items-center justify-center"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Change PIN Code
                </Button>
              </div>

              <div className="pt-4">
                <Label htmlFor="autoLock">Auto-Lock After</Label>
                <Select value={autoLockTime} onValueChange={setAutoLockTime}>
                  <SelectTrigger id="autoLock" className="w-full mt-1">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Healthcare Standards</CardTitle>
              <CardDescription>
                Configure integration with healthcare data standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>FHIR Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable Fast Healthcare Interoperability Resources
                  </p>
                </div>
                <Switch checked={enableFHIR} onCheckedChange={setEnableFHIR} />
              </div>

              {enableFHIR && (
                <div className="space-y-4 mt-4 p-4 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="fhirServer">FHIR Server URL</Label>
                    <input
                      id="fhirServer"
                      type="text"
                      placeholder="https://fhir.example.org/r4"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fhirToken">API Token</Label>
                    <input
                      id="fhirToken"
                      type="password"
                      placeholder="Enter your FHIR API token"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <Button className="w-full mt-2">Test Connection</Button>
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <div className="space-y-0.5">
                  <Label>openEHR Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable openEHR standard for health records
                  </p>
                </div>
                <Switch
                  checked={enableOpenEHR}
                  onCheckedChange={setEnableOpenEHR}
                />
              </div>

              {enableOpenEHR && (
                <div className="space-y-4 mt-4 p-4 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="openEhrServer">openEHR Server URL</Label>
                    <input
                      id="openEhrServer"
                      type="text"
                      placeholder="https://openehr.example.org/rest"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openEhrUsername">Username</Label>
                    <input
                      id="openEhrUsername"
                      type="text"
                      placeholder="Enter your username"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openEhrPassword">Password</Label>
                    <input
                      id="openEhrPassword"
                      type="password"
                      placeholder="Enter your password"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <Button className="w-full mt-2">Test Connection</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Integration with healthcare standards allows for better
              interoperability with medical systems.
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>
                Manage your data backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Regularly backup your data
                  </p>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>

              {autoBackup && (
                <div className="pt-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={backupFrequency}
                    onValueChange={setBackupFrequency}
                  >
                    <SelectTrigger id="backupFrequency" className="w-full mt-1">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline">Backup Now</Button>
                <Button variant="outline">Restore Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications from the app
                  </p>
                </div>
                <Switch
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>

              {enableNotifications && (
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label>Reminder Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders about follow-ups
                    </p>
                  </div>
                  <Switch
                    checked={reminderNotifications}
                    onCheckedChange={setReminderNotifications}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cloud Sync Tab */}
        <TabsContent value="cloud" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cloud Synchronization</CardTitle>
              <CardDescription>
                Configure cloud storage for your implant data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupabaseSetup
                onSetupComplete={() => setSupabaseConfigured(true)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.language.title")}</CardTitle>
              <CardDescription>
                {t("settings.language.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => setLanguage("en")}
                  className="w-full"
                >
                  {t("settings.language.english")}
                </Button>
                <Button
                  variant={language === "de" ? "default" : "outline"}
                  onClick={() => setLanguage("de")}
                  className="w-full"
                >
                  {t("settings.language.german")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsScreen;
