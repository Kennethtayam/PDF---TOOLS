const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

// 📁 Function to get all PDFs in a folder (and subfolders)
function getAllPDFs(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllPDFs(filePath));
      } else if (path.extname(file).toLowerCase() === ".pdf") {
        results.push(filePath);
      }
    });
  } catch (err) {
    console.error(`❗ Error reading directory ${dir}:`, err.message);
  }
  return results;
}

// 🔍 Detect if PDF is incorrectly rotated
async function checkPDFOrientation(filePath) {
  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();
    return width > height ? "landscape" : "portrait";
  } catch (err) {
    console.error(`❗ Error checking orientation for ${filePath}:`, err.message);
    return null;
  }
}

// 🔄 Rotate and save the PDF (if needed)
async function rotatePDF(filePath) {
  const orientation = await checkPDFOrientation(filePath);
  if (orientation === "landscape") {
    console.log(`🔄 Rotating: ${filePath}`);
    try {
      const pdfBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.getPages().forEach((page) => {
        page.setRotation(page.getRotation().rotate(90));
      });
      const rotatedBytes = await pdfDoc.save();
      fs.writeFileSync(filePath, rotatedBytes);
      console.log(`✅ Fixed: ${filePath}`);
    } catch (err) {
      console.error(`❗ Error rotating ${filePath}:`, err.message);
    }
  } else if (orientation === "portrait") {
    console.log(`✔️ Already correct: ${filePath}`);
  }
}

// 🚀 Scan folder and process PDFs
async function scanAndFixPDFs(folderPath) {
  console.log(`📁 Scanning folder: ${folderPath}`);
  const pdfFiles = getAllPDFs(folderPath);

  if (pdfFiles.length === 0) {
    console.log("❌ No PDF files found.");
    return;
  }

  for (const file of pdfFiles) {
    try {
      await rotatePDF(file);
    } catch (err) {
      console.error(`❗ Error processing ${file}:`, err.message);
    }
  }

  console.log("🎉 All PDFs processed!");
}

// 🛠️ Define the folder path
const folderPath = path.resolve("C:\\Users\\Kenneth\\Desktop\\SCAN FILES\\2024 SCANNED FILE");


if (!fs.existsSync(folderPath)) {
  console.error(`❌ Folder not found: ${folderPath}`);
  process.exit(1);
}

// 🚀 Run the script
scanAndFixPDFs(folderPath);

console.log(`🔍 Scanning folder path: ${folderPath}`);
