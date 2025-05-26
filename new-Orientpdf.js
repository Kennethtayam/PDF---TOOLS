
const { PDFDocument } = require('pdf-lib');
const fs = require('node:fs/promises');

async function autoOrientPdf(inputPath, outputPath) {
  try {
    const pdfBytes = await fs.readFile(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();

      if (width > height) {
        if (page.getRotation() === 0)
          page.setRotation(270);
      } else if (height > width) {
        if (page.getRotation() === 270)
          page.setRotation(0);
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, modifiedPdfBytes);

    console.log('PDF auto-oriented and saved successfully!');
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

// Example usage:
const inputPath = 'input.pdf';
const outputPath = 'output.pdf';

autoOrientPdf(inputPath, outputPath);































































// const fs = require("fs");
// const path = require("path");
// const readline = require("readline");
// const { PDFDocument } = require("pdf-lib");

// // 📄 Function to rotate a PDF file
// async function rotatePDF(filePath, rotationDegrees) {
//   try {
//     const pdfBytes = fs.readFileSync(filePath);
//     const pdfDoc = await PDFDocument.load(pdfBytes);

//     pdfDoc.getPages().forEach((page) => {
//       page.setRotation(page.getRotation().rotate(rotationDegrees));
//     });

//     const rotatedBytes = await pdfDoc.save();
//     fs.writeFileSync(filePath, rotatedBytes);

//     console.log(`✅ Rotated: ${filePath}`);
//   } catch (err) {
//     console.error(`❗ Error rotating ${filePath}:`, err.message);
//   }
// }

// // 📁 Get a list of PDF files from a folder
// function getPDFsFromFolder(folderPath) {
//   return fs.readdirSync(folderPath)
//     .filter((file) => path.extname(file).toLowerCase() === ".pdf")
//     .map((file) => path.join(folderPath, file));
// }

// // 📌 Ask the user for input
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// function askQuestion(query) {
//   return new Promise((resolve) => rl.question(query, resolve));
// }

// // 🚀 Main function to process PDFs one by one
// async function processPDFsOneByOne(folderPath) {
//   const pdfFiles = getPDFsFromFolder(folderPath);

//   if (pdfFiles.length === 0) {
//     console.log("❌ No PDF files found.");
//     rl.close();
//     return;
//   }

//   for (const file of pdfFiles) {
//     console.log(`📄 Processing: ${file}`);
//     const answer = await askQuestion("Rotate? (90/180/270/skip): ");

//     if (answer === "skip") {
//       console.log("⏭️ Skipped.");
//       continue;
//     }

//     const degrees = parseInt(answer);
//     if ([180].includes(degrees)) {
//       await rotatePDF(file, degrees);
//     } else {
//       console.log("❌ Invalid input. Skipping file.");
//     }
//   }

//   console.log("🎉 All PDFs processed!");
//   rl.close();
// }

// // 🛠️ Set folder path
// const folderPath = "C:/Users/Kenneth/Desktop/Testing Folder/2025 SCANNED FILE";

// if (!fs.existsSync(folderPath)) {
//   console.error(`❌ Folder not found: ${folderPath}`);
//   process.exit(1);
// }

// // 🚀 Start the script
// processPDFsOneByOne(folderPath);