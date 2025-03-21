import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    "auth.title": "Implant Pass",
    "auth.subtitle": "Secure access to your implant information",
    "auth.pin.title": "PIN Code",
    "auth.faceid.title": "Face ID",
    "auth.faceid.description":
      "Use Face ID to quickly and securely access your implant information.",
    "auth.faceid.button": "Authenticate with Face ID",
    "auth.faceid.authenticating": "Authenticating...",
    "auth.pin.setup.title": "Set Up PIN",
    "auth.pin.setup.description":
      "Create a 6-digit PIN to secure your implant data",
    "auth.pin.setup.button": "Set PIN",
    "auth.pin.setup.cancel": "Cancel",
    "auth.pin.entry.title": "Enter PIN",
    "auth.pin.entry.button": "Unlock",
    "auth.pin.entry.forgot": "Forgot PIN?",
    "auth.pin.stored":
      "Your PIN is stored securely on your device and is never shared.",
    "auth.pin.incorrect": "Incorrect PIN",
    "auth.pin.attempts": "attempts remaining.",
    "auth.pin.locked": "Account Temporarily Locked",
    "auth.pin.locked.description":
      "Too many failed attempts. Please try again in 30 seconds.",
    "auth.pin.enter.description": "Please enter your 6-digit PIN code",
    "auth.pin.locked.message": "Account temporarily locked",
    "auth.pin.locked.timer": "Please try again in {seconds} seconds",
    "auth.pin.change": "Change PIN Code",
    "auth.pin.success": "PIN successfully created!",
    "auth.pin.return": "Return to Settings",
    "auth.pin.min": "PIN must be at least 4 digits",
    "auth.pin.match": "PINs do not match",

    // Dashboard
    "dashboard.title": "Implant Pass",
    "dashboard.welcome": "Welcome",
    "dashboard.recent": "Recent Procedures",
    "dashboard.viewAll": "View All",
    "dashboard.noProcedures": "No procedures found. Add your first procedure.",
    "dashboard.implants": "implant",
    "dashboard.implants_plural": "implants",
    "dashboard.addNew": "Add New",
    "dashboard.allRecords": "All Records",
    "dashboard.exportGuide": "Export Guide",
    "dashboard.settings": "Settings",
    "dashboard.addProcedure.title": "Add New Procedure",
    "dashboard.addProcedure.description":
      "Choose how you want to add a new procedure",
    "dashboard.addProcedure.scan": "Scan QR Code",
    "dashboard.addProcedure.scanDesc": "Import from a QR code",
    "dashboard.addProcedure.manual": "Manual Entry",
    "dashboard.addProcedure.manualDesc": "Enter details manually",
    "dashboard.addProcedure.cancel": "Cancel",
    "dashboard.whatToDo": "What would you like to do?",

    // Action Buttons
    "actions.scanQR.title": "Scan QR Code",
    "actions.scanQR.description":
      "Scan a QR code to import procedure or implant data",
    "actions.scanQR.button": "Scan Now",
    "actions.viewProcedures.title": "View Procedures",
    "actions.viewProcedures.description":
      "Access your saved procedures and implant details",
    "actions.viewProcedures.button": "View List",
    "actions.manualEntry.title": "Manual Entry",
    "actions.manualEntry.description":
      "Manually add a new procedure and implant information",
    "actions.manualEntry.button": "Add New",

    // Procedure List
    "procedureList.title": "My Procedures",
    "procedureList.add": "Add Procedure",
    "procedureList.search": "Search procedures...",
    "procedureList.noProcedures":
      "No procedures found. Add a new procedure to get started.",
    "procedureList.hospital": "Hospital:",
    "procedureList.surgeon": "Surgeon:",
    "procedureList.location": "Location:",
    "procedureList.implants": "Implants:",
    "procedureList.notes": "Notes:",
    "procedureList.view": "View",
    "procedureList.qr": "QR",
    "procedureList.generating": "Generating...",
    "procedureList.export": "Export",
    "procedureList.edit": "Edit",
    "procedureList.delete": "Delete",
    "procedureList.deleteConfirm.title": "Sind Sie sicher?",
    "procedureList.deleteConfirm.description":
      "Diese Aktion kann nicht rückgängig gemacht werden. Der Eingriff und alle zugehörigen Implantatdaten werden dauerhaft von Ihrem Gerät gelöscht.",
    "procedureList.deleteConfirm.cancel": "Abbrechen",
    "procedureList.deleteConfirm.confirm": "Entfernen",

    // Procedure Form
    "procedureForm.title": "Procedure Information",
    "procedureForm.details.title": "Enter Details",
    "procedureForm.details.description":
      "Enter details about the surgical procedure and implants used.",
    "procedureForm.procedure.title": "Procedure Details",
    "procedureForm.date": "Date",
    "procedureForm.surgeon": "Surgeon",
    "procedureForm.hospital": "Hospital",
    "procedureForm.procedureType": "Procedure Type",
    "procedureForm.location": "Procedure Location",
    "procedureForm.side": "Side (if applicable)",
    "procedureForm.side.left": "Left",
    "procedureForm.side.right": "Right",
    "procedureForm.side.na": "N/A",
    "procedureForm.notes": "Procedure Notes",
    "procedureForm.notes.placeholder":
      "Additional information about the procedure",
    "procedureForm.implants.title": "Implant Details",
    "procedureForm.scanQR": "Scan QR Code",
    "procedureForm.addImplant": "Add Implant",
    "procedureForm.implant": "Implant",
    "procedureForm.implantName": "Implant Name",
    "procedureForm.manufacturer": "Manufacturer",
    "procedureForm.articleNumber": "Article Number",
    "procedureForm.lotNumber": "Lot Number",
    "procedureForm.implantType": "Implant Type",
    "procedureForm.cancel": "Cancel",
    "procedureForm.save": "Save Procedure",

    // Procedure Detail
    "procedureDetail.back": "Back to Procedures",
    "procedureDetail.edit": "Edit",
    "procedureDetail.export": "Export",
    "procedureDetail.qr": "QR",
    "procedureDetail.delete": "Delete",
    "procedureDetail.surgeon": "Surgeon",
    "procedureDetail.hospital": "Hospital",
    "procedureDetail.location": "Location",
    "procedureDetail.notSpecified": "Not specified",
    "procedureDetail.side": "Side",
    "procedureDetail.notes": "Procedure Notes",
    "procedureDetail.implants.title": "Implant Details",
    "procedureDetail.manufacturer": "Manufacturer",
    "procedureDetail.articleNumber": "Article Number",
    "procedureDetail.lotNumber": "Lot Number",
    "procedureDetail.notes": "Notes",
    "procedureDetail.procedureId": "Procedure ID:",

    // Settings
    "settings.title": "Settings",
    "settings.security": "Security",
    "settings.integration": "Integration",
    "settings.backup": "Backup",
    "settings.notifications": "Notifications",
    "settings.cloud": "Cloud Sync",
    "settings.language": "Language",
    "settings.language.title": "Language Settings",
    "settings.language.description": "Choose your preferred language",
    "settings.language.english": "English",
    "settings.language.german": "German",
    "settings.authentication": "Authentication",
    "settings.authentication.description":
      "Configure how you access your implant data",
    "settings.useFaceID": "Use Face ID",
    "settings.useFaceID.description": "Enable Face ID authentication",
    "settings.usePIN": "Use PIN Code",
    "settings.usePIN.description": "Enable PIN code authentication",
    "settings.autoLock": "Auto-Lock After",
    "settings.autoLock.1": "1 minute",
    "settings.autoLock.5": "5 minutes",
    "settings.autoLock.15": "15 minutes",
    "settings.autoLock.30": "30 minutes",
    "settings.autoLock.never": "Never",
    "settings.healthcare": "Healthcare Standards",
    "settings.healthcare.description":
      "Configure integration with healthcare data standards",
    "settings.fhir": "FHIR Integration",
    "settings.fhir.description":
      "Enable Fast Healthcare Interoperability Resources",
    "settings.fhir.server": "FHIR Server URL",
    "settings.fhir.token": "API Token",
    "settings.fhir.test": "Test Connection",
    "settings.openEHR": "openEHR Integration",
    "settings.openEHR.description":
      "Enable openEHR standard for health records",
    "settings.openEHR.server": "openEHR Server URL",
    "settings.openEHR.username": "Username",
    "settings.openEHR.password": "Password",
    "settings.openEHR.test": "Test Connection",
    "settings.integration.footer":
      "Integration with healthcare standards allows for better interoperability with medical systems.",
    "settings.backup.title": "Backup & Restore",
    "settings.backup.description": "Manage your data backup settings",
    "settings.backup.auto": "Automatic Backup",
    "settings.backup.auto.description": "Regularly backup your data",
    "settings.backup.frequency": "Backup Frequency",
    "settings.backup.daily": "Daily",
    "settings.backup.weekly": "Weekly",
    "settings.backup.monthly": "Monthly",
    "settings.backup.now": "Backup Now",
    "settings.backup.restore": "Restore Data",
    "settings.notifications.title": "Notification Settings",
    "settings.notifications.description":
      "Configure how you receive notifications",
    "settings.notifications.enable": "Enable Notifications",
    "settings.notifications.enable.description":
      "Receive notifications from the app",
    "settings.notifications.reminders": "Reminder Notifications",
    "settings.notifications.reminders.description":
      "Receive reminders about follow-ups",
    "settings.cloud.title": "Cloud Synchronization",
    "settings.cloud.description":
      "Configure cloud storage for your implant data",

    // QR Scanner
    "scanner.qr.title": "Scan Implant QR Code",
    "scanner.qr.description":
      "Position the QR code within the camera frame to scan implant information.",
    "scanner.qr.scanning": "Scanning... Please hold steady",
    "scanner.qr.refresh": "Refresh",
    "scanner.qr.activate":
      "Tap the button below to activate your camera and scan an implant QR code.",
    "scanner.qr.start": "Start Scanning",
    "scanner.qr.sample": "Use Sample Data",
    "scanner.qr.cancel": "Cancel Scanning",
    "scanner.qr.scanned.title": "Scanned Procedure Information",
    "scanner.qr.scanned.description":
      "Review the scanned data before importing",
    "scanner.qr.scanned.date": "Date",
    "scanner.qr.scanned.surgeon": "Surgeon",
    "scanner.qr.scanned.hospital": "Hospital",
    "scanner.qr.scanned.procedure": "Procedure Type",
    "scanner.qr.scanned.implants": "Implants",
    "scanner.qr.scanned.name": "Name:",
    "scanner.qr.scanned.manufacturer": "Manufacturer:",
    "scanner.qr.scanned.serial": "Serial Number:",
    "scanner.qr.scanned.type": "Type:",
    "scanner.qr.scanned.location": "Location:",
    "scanner.qr.cancel": "Cancel",
    "scanner.qr.import": "Import Data",
    "scanner.qr.error": "Error",
    "scanner.qr.error.camera":
      "Failed to access camera. Please check permissions and ensure you're using a secure connection (HTTPS).",
    "scanner.qr.error.parse": "Failed to parse QR code data. Please try again.",
    "scanner.qr.error.invalid":
      "Invalid QR code format. Please try scanning a valid implant QR code.",

    // Bluetooth Scanner
    "scanner.bluetooth.article.title": "Scan Article Number",
    "scanner.bluetooth.lot.title": "Scan Lot Number",
    "scanner.bluetooth.description":
      "Connect a Bluetooth scanner to scan barcodes directly.",
    "scanner.bluetooth.waiting": "Waiting for Bluetooth scanner input...",
    "scanner.bluetooth.connect": "Connect Scanner",
    "scanner.bluetooth.manual": "Manual Entry",
    "scanner.bluetooth.manual.title": "Manual Entry",
    "scanner.bluetooth.manual.article": "Enter the article number manually.",
    "scanner.bluetooth.manual.lot": "Enter the lot number manually.",
    "scanner.bluetooth.cancel": "Cancel",
    "scanner.bluetooth.submit": "Submit",
    "scanner.bluetooth.cancel.scanning": "Cancel Scanning",
    "scanner.bluetooth.error": "Error connecting to Bluetooth device",
    "scanner.bluetooth.success": "Successfully connected to scanner",
    "scanner.bluetooth.placeholder.article": "Enter article number",
    "scanner.bluetooth.placeholder.lot": "Enter lot number",
    "scanner.bluetooth.disconnected": "Bluetooth scanner disconnected",

    // Export
    "export.title": "Export Options",
    "export.single": "Single Procedure",
    "export.all": "All Procedures",
    "export.single.title": "Export Single Procedure",
    "export.single.description":
      "Generate a QR code for the selected procedure:",
    "export.single.date": "Procedure Date:",
    "export.single.hospital": "Hospital:",
    "export.single.surgeon": "Surgeon:",
    "export.single.implants": "Implants:",
    "export.single.manufacturer": "Manufacturer:",
    "export.single.article": "Article Number:",
    "export.single.lot": "Lot Number:",
    "export.single.type": "Type:",
    "export.single.location": "Location:",
    "export.preview": "Preview QR Code",
    "export.download": "Download Directly",
    "export.all.title": "Export All Procedures",
    "export.all.description":
      "Generate a comprehensive QR code containing all your procedure data",
    "export.all.info":
      "This QR code will contain all your procedure data in a secure format.",
    "export.all.compatible":
      "It can be scanned by healthcare providers with compatible systems.",
    "export.all.count": "procedure",
    "export.all.count_plural": "procedures",
    "export.all.included": "will be included",
    "export.all.preview": "Preview Summary QR Code",
    "export.generating": "Generating...",
    "export.qr.single": "Procedure QR Code",
    "export.qr.all": "Summary QR Code",
    "export.qr.access": "Scan this QR code to access your",
    "export.qr.procedure": "procedure",
    "export.qr.procedures": "procedures",
    "export.qr.data": "data.",
    "export.qr.generating": "Generating QR code...",
    "export.qr.unavailable": "QR Code not available",
    "export.qr.save": "Save to Photos",
    "export.qr.share": "Share",
    "export.error":
      "No procedure data found. Please select a procedure to export.",
    "export.guide.title": "Implant Pass Export & Testing Guide",
    "export.guide.qr": "QR Code Testing",
    "export.guide.appstore": "App Store Guide",

    // Footer
    "footer.copyright": "Secure Digital Implant Pass",
  },
  de: {
    // Auth
    "auth.title": "Implantat-Pass",
    "auth.subtitle": "Sicherer Zugriff auf Ihre Implantatinformationen",
    "auth.pin.title": "PIN-Code",
    "auth.faceid.title": "Face ID",
    "auth.faceid.description":
      "Verwenden Sie Face ID, um schnell und sicher auf Ihre Implantatinformationen zuzugreifen.",
    "auth.faceid.button": "Mit Face ID authentifizieren",
    "auth.faceid.authenticating": "Authentifizierung...",
    "auth.pin.setup.title": "PIN einrichten",
    "auth.pin.setup.description":
      "Erstellen Sie eine 6-stellige PIN, um Ihre Implantatdaten zu sichern",
    "auth.pin.setup.button": "PIN festlegen",
    "auth.pin.setup.cancel": "Abbrechen",
    "auth.pin.entry.title": "PIN eingeben",
    "auth.pin.entry.button": "Entsperren",
    "auth.pin.entry.forgot": "PIN vergessen?",
    "auth.pin.stored":
      "Ihre PIN wird sicher auf Ihrem Gerät gespeichert und niemals weitergegeben.",
    "auth.pin.incorrect": "Falsche PIN",
    "auth.pin.attempts": "Versuche übrig.",
    "auth.pin.locked": "Konto vorübergehend gesperrt",
    "auth.pin.locked.description":
      "Zu viele fehlgeschlagene Versuche. Bitte versuchen Sie es in 30 Sekunden erneut.",
    "auth.pin.enter.description":
      "Bitte geben Sie Ihren 6-stelligen PIN-Code ein",
    "auth.pin.locked.message": "Konto vorübergehend gesperrt",
    "auth.pin.locked.timer":
      "Bitte versuchen Sie es in {seconds} Sekunden erneut",
    "auth.pin.change": "PIN-Code ändern",
    "auth.pin.success": "PIN erfolgreich erstellt!",
    "auth.pin.return": "Zurück zu Einstellungen",
    "auth.pin.min": "PIN muss mindestens 4 Ziffern haben",
    "auth.pin.match": "PINs stimmen nicht überein",

    // Dashboard
    "dashboard.title": "Implantat-Pass",
    "dashboard.welcome": "Willkommen",
    "dashboard.recent": "Aktuelle Eingriffe",
    "dashboard.viewAll": "Alle anzeigen",
    "dashboard.noProcedures":
      "Keine Eingriffe gefunden. Fügen Sie Ihren ersten Eingriff hinzu.",
    "dashboard.implants": "Implantat",
    "dashboard.implants_plural": "Implantate",
    "dashboard.addNew": "Neu hinzufügen",
    "dashboard.allRecords": "Alle Einträge",
    "dashboard.exportGuide": "Export-Anleitung",
    "dashboard.settings": "Einstellungen",
    "dashboard.addProcedure.title": "Neuen Eingriff hinzufügen",
    "dashboard.addProcedure.description":
      "Wählen Sie, wie Sie einen neuen Eingriff hinzufügen möchten",
    "dashboard.addProcedure.scan": "QR-Code scannen",
    "dashboard.addProcedure.scanDesc": "Import von einem QR-Code",
    "dashboard.addProcedure.manual": "Manuelle Eingabe",
    "dashboard.addProcedure.manualDesc": "Details manuell eingeben",
    "dashboard.addProcedure.cancel": "Abbrechen",
    "dashboard.whatToDo": "Was möchten Sie tun?",

    // Action Buttons
    "actions.scanQR.title": "QR-Code scannen",
    "actions.scanQR.description":
      "Scannen Sie einen QR-Code, um Eingriffs- oder Implantatdaten zu importieren",
    "actions.scanQR.button": "Jetzt scannen",
    "actions.viewProcedures.title": "Eingriffe anzeigen",
    "actions.viewProcedures.description":
      "Greifen Sie auf Ihre gespeicherten Eingriffe und Implantatdetails zu",
    "actions.viewProcedures.button": "Liste anzeigen",
    "actions.manualEntry.title": "Manuelle Eingabe",
    "actions.manualEntry.description":
      "Fügen Sie manuell einen neuen Eingriff und Implantatinformationen hinzu",
    "actions.manualEntry.button": "Neu hinzufügen",

    // Procedure List
    "procedureList.title": "Meine Eingriffe",
    "procedureList.add": "Eingriff hinzufügen",
    "procedureList.search": "Eingriffe suchen...",
    "procedureList.noProcedures":
      "Keine Eingriffe gefunden. Fügen Sie einen neuen Eingriff hinzu, um zu beginnen.",
    "procedureList.hospital": "Krankenhaus:",
    "procedureList.surgeon": "Chirurg:",
    "procedureList.location": "Ort:",
    "procedureList.implants": "Implantate:",
    "procedureList.notes": "Notizen:",
    "procedureList.view": "Ansehen",
    "procedureList.qr": "QR",
    "procedureList.generating": "Generiere...",
    "procedureList.export": "Exportieren",
    "procedureList.edit": "Bearbeiten",
    "procedureList.delete": "Entfernen",
    "procedureList.deleteConfirm.title": "Sind Sie sicher?",
    "procedureList.deleteConfirm.description":
      "Diese Aktion kann nicht rückgängig gemacht werden. Der Eingriff und alle zugehörigen Implantatdaten werden dauerhaft von Ihrem Gerät gelöscht.",
    "procedureList.deleteConfirm.cancel": "Abbrechen",
    "procedureList.deleteConfirm.confirm": "Entfernen",

    // Procedure Form
    "procedureForm.title": "Eingriffsinformationen",
    "procedureForm.details.title": "Details eingeben",
    "procedureForm.details.description":
      "Geben Sie Details zum chirurgischen Eingriff und den verwendeten Implantaten ein.",
    "procedureForm.procedure.title": "Eingriffsdetails",
    "procedureForm.date": "Datum",
    "procedureForm.surgeon": "Chirurg",
    "procedureForm.hospital": "Krankenhaus",
    "procedureForm.procedureType": "Eingriffstyp",
    "procedureForm.location": "Eingriffsort",
    "procedureForm.side": "Seite (falls zutreffend)",
    "procedureForm.side.left": "Links",
    "procedureForm.side.right": "Rechts",
    "procedureForm.side.na": "N/A",
    "procedureForm.notes": "Eingriffsnotizen",
    "procedureForm.notes.placeholder": "Zusätzliche Informationen zum Eingriff",
    "procedureForm.implants.title": "Implantatdetails",
    "procedureForm.scanQR": "QR-Code scannen",
    "procedureForm.addImplant": "Implantat hinzufügen",
    "procedureForm.implant": "Implantat",
    "procedureForm.implantName": "Implantatname",
    "procedureForm.manufacturer": "Hersteller",
    "procedureForm.articleNumber": "Artikelnummer",
    "procedureForm.lotNumber": "Chargennummer",
    "procedureForm.implantType": "Implantattyp",
    "procedureForm.cancel": "Abbrechen",
    "procedureForm.save": "Eingriff speichern",

    // Procedure Detail
    "procedureDetail.back": "Zurück zu Eingriffen",
    "procedureDetail.edit": "Bearbeiten",
    "procedureDetail.export": "Exportieren",
    "procedureDetail.qr": "QR",
    "procedureDetail.delete": "Entfernen",
    "procedureDetail.surgeon": "Chirurg",
    "procedureDetail.hospital": "Krankenhaus",
    "procedureDetail.location": "Ort",
    "procedureDetail.notSpecified": "Nicht angegeben",
    "procedureDetail.side": "Seite",
    "procedureDetail.notes": "Eingriffsnotizen",
    "procedureDetail.implants.title": "Implantatdetails",
    "procedureDetail.manufacturer": "Hersteller",
    "procedureDetail.articleNumber": "Artikelnummer",
    "procedureDetail.lotNumber": "Chargennummer",
    "procedureDetail.notes": "Notizen",
    "procedureDetail.procedureId": "Eingriffs-ID:",

    // Settings
    "settings.title": "Einstellungen",
    "settings.security": "Sicherheit",
    "settings.integration": "Integration",
    "settings.backup": "Sicherung",
    "settings.notifications": "Benachrichtigungen",
    "settings.cloud": "Cloud-Synchronisation",
    "settings.language": "Sprache",
    "settings.language.title": "Spracheinstellungen",
    "settings.language.description": "Wählen Sie Ihre bevorzugte Sprache",
    "settings.language.english": "Englisch",
    "settings.language.german": "Deutsch",
    "settings.authentication": "Authentifizierung",
    "settings.authentication.description":
      "Konfigurieren Sie, wie Sie auf Ihre Implantatdaten zugreifen",
    "settings.useFaceID": "Face ID verwenden",
    "settings.useFaceID.description": "Face ID-Authentifizierung aktivieren",
    "settings.usePIN": "PIN-Code verwenden",
    "settings.usePIN.description": "PIN-Code-Authentifizierung aktivieren",
    "settings.autoLock": "Automatische Sperre nach",
    "settings.autoLock.1": "1 Minute",
    "settings.autoLock.5": "5 Minuten",
    "settings.autoLock.15": "15 Minuten",
    "settings.autoLock.30": "30 Minuten",
    "settings.autoLock.never": "Nie",
    "settings.healthcare": "Gesundheitsstandards",
    "settings.healthcare.description":
      "Integration mit Gesundheitsdatenstandards konfigurieren",
    "settings.fhir": "FHIR-Integration",
    "settings.fhir.description":
      "Fast Healthcare Interoperability Resources aktivieren",
    "settings.fhir.server": "FHIR-Server-URL",
    "settings.fhir.token": "API-Token",
    "settings.fhir.test": "Verbindung testen",
    "settings.openEHR": "openEHR-Integration",
    "settings.openEHR.description":
      "openEHR-Standard für Gesundheitsakten aktivieren",
    "settings.openEHR.server": "openEHR-Server-URL",
    "settings.openEHR.username": "Benutzername",
    "settings.openEHR.password": "Passwort",
    "settings.openEHR.test": "Verbindung testen",
    "settings.integration.footer":
      "Die Integration mit Gesundheitsstandards ermöglicht eine bessere Interoperabilität mit medizinischen Systemen.",
    "settings.backup.title": "Sicherung & Wiederherstellung",
    "settings.backup.description":
      "Verwalten Sie Ihre Datensicherungseinstellungen",
    "settings.backup.auto": "Automatische Sicherung",
    "settings.backup.auto.description": "Regelmäßige Sicherung Ihrer Daten",
    "settings.backup.frequency": "Sicherungshäufigkeit",
    "settings.backup.daily": "Täglich",
    "settings.backup.weekly": "Wöchentlich",
    "settings.backup.monthly": "Monatlich",
    "settings.backup.now": "Jetzt sichern",
    "settings.backup.restore": "Daten wiederherstellen",
    "settings.notifications.title": "Benachrichtigungseinstellungen",
    "settings.notifications.description":
      "Konfigurieren Sie, wie Sie Benachrichtigungen erhalten",
    "settings.notifications.enable": "Benachrichtigungen aktivieren",
    "settings.notifications.enable.description":
      "Benachrichtigungen von der App erhalten",
    "settings.notifications.reminders": "Erinnerungsbenachrichtigungen",
    "settings.notifications.reminders.description":
      "Erinnerungen zu Nachuntersuchungen erhalten",
    "settings.cloud.title": "Cloud-Synchronisation",
    "settings.cloud.description":
      "Cloud-Speicher für Ihre Implantatdaten konfigurieren",

    // QR Scanner
    "scanner.qr.title": "Implantat-QR-Code scannen",
    "scanner.qr.description":
      "Positionieren Sie den QR-Code innerhalb des Kamerarahmens, um Implantatinformationen zu scannen.",
    "scanner.qr.scanning": "Scannen... Bitte halten Sie ruhig",
    "scanner.qr.refresh": "Aktualisieren",
    "scanner.qr.activate":
      "Tippen Sie auf die Schaltfläche unten, um Ihre Kamera zu aktivieren und einen Implantat-QR-Code zu scannen.",
    "scanner.qr.start": "Scannen starten",
    "scanner.qr.sample": "Beispieldaten verwenden",
    "scanner.qr.cancel": "Scannen abbrechen",
    "scanner.qr.scanned.title": "Gescannte Eingriffsinformationen",
    "scanner.qr.scanned.description":
      "Überprüfen Sie die gescannten Daten vor dem Import",
    "scanner.qr.scanned.date": "Datum",
    "scanner.qr.scanned.surgeon": "Chirurg",
    "scanner.qr.scanned.hospital": "Krankenhaus",
    "scanner.qr.scanned.procedure": "Eingriffstyp",
    "scanner.qr.scanned.implants": "Implantate",
    "scanner.qr.scanned.name": "Name:",
    "scanner.qr.scanned.manufacturer": "Hersteller:",
    "scanner.qr.scanned.serial": "Seriennummer:",
    "scanner.qr.scanned.type": "Typ:",
    "scanner.qr.scanned.location": "Ort:",
    "scanner.qr.cancel": "Abbrechen",
    "scanner.qr.import": "Daten importieren",
    "scanner.qr.error": "Fehler",
    "scanner.qr.error.camera":
      "Kamerazugriff fehlgeschlagen. Bitte überprüfen Sie die Berechtigungen und stellen Sie sicher, dass Sie eine sichere Verbindung (HTTPS) verwenden.",
    "scanner.qr.error.parse":
      "QR-Code-Daten konnten nicht analysiert werden. Bitte versuchen Sie es erneut.",
    "scanner.qr.error.invalid":
      "Ungültiges QR-Code-Format. Bitte versuchen Sie, einen gültigen Implantat-QR-Code zu scannen.",

    // Bluetooth Scanner
    "scanner.bluetooth.article.title": "Artikelnummer scannen",
    "scanner.bluetooth.lot.title": "Chargennummer scannen",
    "scanner.bluetooth.description":
      "Verbinden Sie einen Bluetooth-Scanner, um Barcodes direkt zu scannen.",
    "scanner.bluetooth.waiting": "Warte auf Bluetooth-Scanner-Eingabe...",
    "scanner.bluetooth.connect": "Scanner verbinden",
    "scanner.bluetooth.manual": "Manuelle Eingabe",
    "scanner.bluetooth.manual.title": "Manuelle Eingabe",
    "scanner.bluetooth.manual.article":
      "Geben Sie die Artikelnummer manuell ein.",
    "scanner.bluetooth.manual.lot": "Geben Sie die Chargennummer manuell ein.",
    "scanner.bluetooth.cancel": "Abbrechen",
    "scanner.bluetooth.submit": "Absenden",
    "scanner.bluetooth.cancel.scanning": "Scannen abbrechen",
    "scanner.bluetooth.error": "Fehler beim Verbinden mit Bluetooth-Gerät",
    "scanner.bluetooth.success": "Erfolgreich mit Scanner verbunden",
    "scanner.bluetooth.placeholder.article": "Artikelnummer eingeben",
    "scanner.bluetooth.placeholder.lot": "Chargennummer eingeben",
    "scanner.bluetooth.disconnected": "Bluetooth-Scanner getrennt",

    // Export
    "export.title": "Exportoptionen",
    "export.single": "Einzelner Eingriff",
    "export.all": "Alle Eingriffe",
    "export.single.title": "Einzelnen Eingriff exportieren",
    "export.single.description":
      "Generieren Sie einen QR-Code für den ausgewählten Eingriff:",
    "export.single.date": "Eingriffsdatum:",
    "export.single.hospital": "Krankenhaus:",
    "export.single.surgeon": "Chirurg:",
    "export.single.implants": "Implantate:",
    "export.single.manufacturer": "Hersteller:",
    "export.single.article": "Artikelnummer:",
    "export.single.lot": "Chargennummer:",
    "export.single.type": "Typ:",
    "export.single.location": "Ort:",
    "export.preview": "QR-Code Vorschau",
    "export.download": "Direkt herunterladen",
    "export.all.title": "Alle Eingriffe exportieren",
    "export.all.description":
      "Generieren Sie einen umfassenden QR-Code mit allen Ihren Eingriffsdaten",
    "export.all.info":
      "Dieser QR-Code enthält alle Ihre Eingriffsdaten in einem sicheren Format.",
    "export.all.compatible":
      "Er kann von Gesundheitsdienstleistern mit kompatiblen Systemen gescannt werden.",
    "export.all.count": "Eingriff",
    "export.all.count_plural": "Eingriffe",
    "export.all.included": "werden enthalten sein",
    "export.all.preview": "Zusammenfassungs-QR-Code Vorschau",
    "export.generating": "Generiere...",
    "export.qr.single": "Eingriffs-QR-Code",
    "export.qr.all": "Zusammenfassungs-QR-Code",
    "export.qr.access": "Scannen Sie diesen QR-Code, um auf Ihre",
    "export.qr.procedure": "Eingriff",
    "export.qr.procedures": "Eingriffe",
    "export.qr.data": "Daten zuzugreifen.",
    "export.qr.generating": "QR-Code wird generiert...",
    "export.qr.unavailable": "QR-Code nicht verfügbar",
    "export.qr.save": "In Fotos speichern",
    "export.qr.share": "Teilen",
    "export.error":
      "Keine Eingriffsdaten gefunden. Bitte wählen Sie einen Eingriff zum Exportieren aus.",
    "export.guide.title": "Implantat-Pass Export- & Testanleitung",
    "export.guide.qr": "QR-Code-Test",
    "export.guide.appstore": "App Store-Anleitung",

    // Footer
    "footer.copyright": "Sicherer digitaler Implantat-Pass",
  },
};

const LanguageContext = createContext<LanguageContextType>(
  {} as LanguageContextType,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "de")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translationSet = translations[language];
    return translationSet[key] || key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
