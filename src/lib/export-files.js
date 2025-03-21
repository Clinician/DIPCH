import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";

// Get current file's directory name (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a file to stream archive data to
const output = fs.createWriteStream(
  path.join(__dirname, "../../implant-pass-export.zip"),
);
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level
});

// Listen for all archive data to be written
output.on("close", function () {
  console.log("Archive created successfully");
  console.log(archive.pointer() + " total bytes");
});

// Good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    console.warn("Warning during archiving:", err);
  } else {
    throw err;
  }
});

// Good practice to catch this error explicitly
archive.on("error", function (err) {
  console.error("Error during archiving:", err);
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add directories and files
const filesToInclude = [
  { source: "src", destination: "src" },
  { source: "public", destination: "public" },
  { source: "index.html", destination: "index.html" },
  { source: "vite.config.ts", destination: "vite.config.ts" },
  { source: "tsconfig.json", destination: "tsconfig.json" },
  { source: "tsconfig.node.json", destination: "tsconfig.node.json" },
  { source: "tailwind.config.js", destination: "tailwind.config.js" },
  { source: "postcss.config.js", destination: "postcss.config.js" },
  { source: "package.json", destination: "package.json" },
  { source: "capacitor.config.ts", destination: "capacitor.config.ts" },
  { source: "ios-export-guide.md", destination: "ios-export-guide.md" },
  {
    source: "app-store-submission-guide.md",
    destination: "app-store-submission-guide.md",
  },
];

filesToInclude.forEach((item) => {
  const sourcePath = path.join(__dirname, "../../", item.source);

  try {
    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      // Add directory content
      archive.directory(sourcePath, item.destination);
      console.log(`Added directory: ${item.source}`);
    } else {
      // Add file
      archive.file(sourcePath, { name: item.destination });
      console.log(`Added file: ${item.source}`);
    }
  } catch (err) {
    console.warn(
      `Warning: Could not add ${item.source}. Error: ${err.message}`,
    );
  }
});

// Finalize the archive (ie we are done appending files but streams have to finish yet)
archive.finalize();

console.log("Archive process started...");
