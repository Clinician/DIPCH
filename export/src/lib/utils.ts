import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to DD.MM.YYYY
export function formatDateString(dateString: string): string {
  if (!dateString) return "";

  try {
    // Check if the date is already in DD.MM.YYYY format
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
      return dateString; // Already in correct format
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original on error
  }
}

// Parse DD.MM.YYYY to ISO format (YYYY-MM-DD)
export function parseFormattedDate(formattedDate: string): string {
  if (!formattedDate) return "";

  try {
    // Check if already in ISO format
    if (/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
      return formattedDate; // Already in ISO format
    }

    const [day, month, year] = formattedDate.split(".");
    if (!day || !month || !year) return formattedDate;

    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) return formattedDate;

    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error parsing formatted date:", error);
    return formattedDate;
  }
}
