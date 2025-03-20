import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProcedures } from "../../context/ProcedureContext";
import { useLanguage } from "../../context/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2, Save, ArrowLeft, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { formatDateString, parseFormattedDate } from "../../lib/utils";
import QRScanner from "../scanner/QRScanner";
import BluetoothScanner from "../scanner/BluetoothScanner";
import { disconnectBluetoothScanner } from "../../lib/bluetooth";

// Define the schema for implant data
const implantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Implant name is required" }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  articleNumber: z.string().min(1, { message: "Article number is required" }),
  lotNumber: z.string().min(1, { message: "Lot number is required" }),
  type: z.string().min(1, { message: "Implant type is required" }),
  location: z.string().optional(),
  notes: z.string().optional(),
});

// Define the schema for procedure data
const procedureFormSchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, { message: "Procedure date is required" }),
  surgeon: z.string().min(1, { message: "Surgeon name is required" }),
  hospital: z.string().min(1, { message: "Hospital name is required" }),
  procedureType: z.string().min(1, { message: "Procedure type is required" }),
  location: z.string().optional(),
  side: z.string().optional(),
  notes: z.string().optional(),
  implants: z
    .array(implantSchema)
    .min(1, { message: "At least one implant is required" }),
});

type ProcedureFormValues = z.infer<typeof procedureFormSchema>;

interface ProcedureFormProps {
  initialData?: ProcedureFormValues;
  onSave?: (data: ProcedureFormValues) => void;
  onCancel?: () => void;
}

const defaultProcedure: ProcedureFormValues = {
  date: new Date().toISOString().split("T")[0],
  surgeon: "",
  hospital: "",
  procedureType: "",
  location: "",
  side: "",
  notes: "",
  implants: [
    {
      name: "",
      manufacturer: "",
      articleNumber: "",
      lotNumber: "",
      type: "",
      location: "",
      notes: "",
    },
  ],
};

const ProcedureForm = ({
  initialData = defaultProcedure,
  onSave = () => {},
  onCancel = () => {},
}: ProcedureFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProcedure, updateProcedure, getProcedureById } = useProcedures();
  const { t } = useLanguage();

  // State for QR scanner and Bluetooth scanner
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showBluetoothScanner, setShowBluetoothScanner] = useState(false);
  const [bluetoothScannerType, setBluetoothScannerType] = useState<
    "article" | "lot"
  >("article");
  const [currentImplantIndex, setCurrentImplantIndex] = useState<number>(0);

  const form = useForm<ProcedureFormValues>({
    resolver: zodResolver(procedureFormSchema),
    defaultValues: initialData,
  });

  // If we have an ID, load the procedure data
  useEffect(() => {
    const loadProcedureData = async () => {
      if (id) {
        try {
          const procedureData = await getProcedureById(id);
          if (procedureData) {
            console.log("Loaded procedure data for editing:", procedureData);
            // Convert to form values format
            const formData = {
              ...procedureData,
              date:
                procedureData.date || new Date().toISOString().split("T")[0],
              procedureType: procedureData.procedureType || "",
              location: procedureData.location || "",
              side: procedureData.side || "",
              implants: procedureData.implants?.map((imp) => ({
                ...imp,
                id:
                  imp.id ||
                  `imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                name: imp.name || "",
                manufacturer: imp.manufacturer || "",
                articleNumber: imp.articleNumber || "",
                lotNumber: imp.lotNumber || "",
                type: imp.type || "",
                location: imp.location || "",
                notes: imp.notes || "",
              })) || [
                {
                  id: `imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                  name: "",
                  manufacturer: "",
                  articleNumber: "",
                  lotNumber: "",
                  type: "",
                  location: "",
                  notes: "",
                },
              ],
            };

            // Reset form with this data
            form.reset(formData);
          } else {
            console.error("No procedure found with ID:", id);
          }
        } catch (error) {
          console.error("Error loading procedure for editing:", error);
        }
      }
    };

    loadProcedureData();
  }, [id, getProcedureById, form]);

  // Navigation handlers
  const handleCancel = () => {
    navigate(-1);
    onCancel();
  };

  const handleSave = async (data: ProcedureFormValues) => {
    try {
      console.log("Saving procedure data:", data);

      // Ensure we have all required fields
      if (
        !data.date ||
        !data.surgeon ||
        !data.hospital ||
        !data.procedureType
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Ensure we have at least one implant with required fields
      if (
        !data.implants ||
        data.implants.length === 0 ||
        !data.implants[0].name ||
        !data.implants[0].manufacturer ||
        !data.implants[0].articleNumber ||
        !data.implants[0].lotNumber ||
        !data.implants[0].type
      ) {
        throw new Error(
          "Please add at least one implant with all required fields",
        );
      }

      // Ensure each implant has an ID
      const processedData = {
        ...data,
        implants: data.implants.map((implant) => ({
          ...implant,
          id:
            implant.id ||
            `imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        })),
      };

      // Generate a unique ID for new procedures to prevent duplicates
      const uniqueId = `proc-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      if (id) {
        // Update existing procedure
        console.log("Updating existing procedure with ID:", id);
        await updateProcedure(id, processedData);
      } else {
        // Add new procedure with unique ID
        console.log("Adding new procedure with ID:", uniqueId);
        await addProcedure({
          ...processedData,
          id: uniqueId,
        });
      }

      // Disconnect scanner before navigating away
      await disconnectBluetoothScanner();

      onSave(processedData);
      console.log("Procedure saved successfully");
      navigate("/"); // Navigate back to home/list after saving
    } catch (error) {
      console.error("Error saving procedure:", error);
      alert(
        "Failed to save procedure: " +
          (error instanceof Error ? error.message : "Please try again"),
      );
    }
  };

  const { control, handleSubmit, formState, watch, setValue } = form;
  const { errors } = formState;
  const implants = watch("implants");

  const addImplant = () => {
    const currentImplants = form.getValues().implants || [];
    setValue("implants", [
      ...currentImplants,
      {
        name: "",
        manufacturer: "",
        articleNumber: "",
        lotNumber: "",
        type: "",
        location: "",
        notes: "",
      },
    ]);
  };

  const removeImplant = (index: number) => {
    const currentImplants = [...form.getValues().implants];
    currentImplants.splice(index, 1);
    setValue("implants", currentImplants);
  };

  const onSubmit = async (data: ProcedureFormValues) => {
    await handleSave(data);
  };

  // Handle QR scan completion
  const handleQRScanComplete = (procedureData: any) => {
    console.log("QR scan complete with data:", procedureData);
    setShowQRScanner(false);

    if (!procedureData) return;

    // Update form with scanned procedure data
    form.reset({
      ...form.getValues(),
      date: procedureData.date || form.getValues().date,
      surgeon: procedureData.surgeon || form.getValues().surgeon,
      hospital: procedureData.hospital || form.getValues().hospital,
      procedureType:
        procedureData.procedureType || form.getValues().procedureType,
      location: procedureData.location || form.getValues().location,
      side: procedureData.side || form.getValues().side,
      notes: procedureData.notes || form.getValues().notes,
      implants:
        procedureData.implants?.length > 0
          ? procedureData.implants.map((imp: any) => {
              // Merge serialNumber into lotNumber if available
              const mergedLotNumber = imp.lotNumber || imp.serialNumber || "";

              return {
                id:
                  imp.id ||
                  `imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                name: imp.name || "",
                manufacturer: imp.manufacturer || "",
                articleNumber: imp.articleNumber || "",
                lotNumber: mergedLotNumber,
                type: imp.type || "",
                location: imp.location || "",
                notes: imp.notes || "",
              };
            })
          : form.getValues().implants,
    });
  };

  // Handle Bluetooth scan completion
  const handleBluetoothScanComplete = (scannedValue: string) => {
    console.log(
      `Bluetooth scan complete with ${bluetoothScannerType} number:`,
      scannedValue,
    );

    if (!scannedValue) return;

    // Get current implants array
    const currentImplants = form.getValues().implants;

    if (
      currentImplantIndex >= 0 &&
      currentImplantIndex < currentImplants.length
    ) {
      // Create a new implants array with the updated value
      const updatedImplants = [...currentImplants];

      // Update the appropriate field based on scanner type
      if (bluetoothScannerType === "article") {
        updatedImplants[currentImplantIndex] = {
          ...updatedImplants[currentImplantIndex],
          articleNumber: scannedValue,
        };
      } else if (bluetoothScannerType === "lot") {
        updatedImplants[currentImplantIndex] = {
          ...updatedImplants[currentImplantIndex],
          lotNumber: scannedValue,
        };
      }

      // Update the form
      form.setValue("implants", updatedImplants);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{t("procedureForm.title")}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {t("procedureForm.details.title")}
          </CardTitle>
          <CardDescription>
            {t("procedureForm.details.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  {t("procedureForm.procedure.title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("procedureForm.date")}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="surgeon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("procedureForm.surgeon")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="hospital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("procedureForm.hospital")}</FormLabel>
                        <FormControl>
                          <Input placeholder="General Hospital" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="procedureType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("procedureForm.procedureType")}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Hip Replacement" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("procedureForm.location")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Hip" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="side"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("procedureForm.side")}</FormLabel>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={
                              field.value === "Left" ? "default" : "outline"
                            }
                            className="flex-1"
                            onClick={() => field.onChange("Left")}
                          >
                            {t("procedureForm.side.left")}
                          </Button>
                          <Button
                            type="button"
                            variant={
                              field.value === "Right" ? "default" : "outline"
                            }
                            className="flex-1"
                            onClick={() => field.onChange("Right")}
                          >
                            {t("procedureForm.side.right")}
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => field.onChange("")}
                          >
                            {t("procedureForm.side.na")}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("procedureForm.notes")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("procedureForm.notes.placeholder")}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {t("procedureForm.implants.title")}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQRScanner(true)}
                      className="flex items-center gap-1"
                    >
                      <QrCode className="h-4 w-4" />
                      {t("procedureForm.scanQR")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addImplant}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      {t("procedureForm.addImplant")}
                    </Button>
                  </div>
                </div>

                {implants?.map((implant, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {t("procedureForm.implant")} {index + 1}
                        </CardTitle>
                        {implants.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImplant(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name={`implants.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("procedureForm.implantName")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Titanium Hip Prosthesis"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`implants.${index}.manufacturer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("procedureForm.manufacturer")}
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="MedTech Inc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`implants.${index}.articleNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("procedureForm.articleNumber")}
                              </FormLabel>
                              <div className="flex">
                                <FormControl>
                                  <Input
                                    placeholder="AN12345678"
                                    {...field}
                                    className="rounded-r-none"
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="rounded-l-none"
                                  onClick={() => {
                                    setCurrentImplantIndex(index);
                                    setBluetoothScannerType("article");
                                    setShowBluetoothScanner(true);
                                  }}
                                >
                                  <QrCode className="h-4 w-4" />
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`implants.${index}.lotNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("procedureForm.lotNumber")}
                              </FormLabel>
                              <div className="flex">
                                <FormControl>
                                  <Input
                                    placeholder="LN98765432"
                                    {...field}
                                    className="rounded-r-none"
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="rounded-l-none"
                                  onClick={() => {
                                    setCurrentImplantIndex(index);
                                    setBluetoothScannerType("lot");
                                    setShowBluetoothScanner(true);
                                  }}
                                >
                                  <QrCode className="h-4 w-4" />
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`implants.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("procedureForm.implantType")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Artificial Joint"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`implants.${index}.notes`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("procedureForm.notes")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Additional details"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {errors.implants?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.implants.message}
                  </p>
                )}
              </div>

              <CardFooter className="flex justify-end gap-2 pt-6">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  {t("procedureForm.cancel")}
                </Button>
                <Button type="submit" className="flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  {t("procedureForm.save")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* QR Scanner Dialog */}
      {showQRScanner && (
        <QRScanner
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onScanComplete={handleQRScanComplete}
        />
      )}

      {/* Bluetooth Scanner Dialog */}
      {showBluetoothScanner && (
        <BluetoothScanner
          isOpen={showBluetoothScanner}
          onClose={() => setShowBluetoothScanner(false)}
          onScanComplete={handleBluetoothScanComplete}
          scannerType={bluetoothScannerType}
        />
      )}
    </div>
  );
};

export default ProcedureForm;
