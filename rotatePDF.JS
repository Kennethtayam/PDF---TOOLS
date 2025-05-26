const fs = require("fs");
const path = require("path");
const { PDFDocument, degrees } = require("pdf-lib");

// 🔁 Auto-orient a single PDF file
async function autoOrientPDF(inputPath, outputPath) {
  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const currentRotation = page.getRotation().angle;

      // 📐 If landscape (width > height) and not already rotated, rotate it
      if (width > height && currentRotation === 0) {
        page.setRotation(degrees(90));
        console.log(`🔄 Page ${index + 1} rotated 90° (landscape to portrait)`);
      } else {
        console.log(`✅ Page ${index + 1} is already correctly oriented`);
      }
    });

    const rotatedBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, rotatedBytes);

    console.log(`🎉 Finished! Saved to: ${outputPath}`);
  } catch (err) {
    console.error("❌ Error processing the PDF:", err.message);
  }
}

// 🛠️ Set input and output path
const inputPDF = "C:\Users\Kenneth\Desktop\SCAN FILES\EMPLOYEE LEAVE CARD - (ACTIVE)\Complete Leave Cards\Leave Cards - Isidro, Danilo A\Isidro, Danilo A._.pdf";
const outputPDF = "C:\Users\Kenneth\Desktop\SCAN FILES\EMPLOYEE LEAVE CARD - (ACTIVE)\Complete Leave Cards\Leave Cards - Isidro, Danilo A\sample_oriented.pdf";

// 🚀 Start the process
if (!fs.existsSync(inputPDF)) {
  console.error(`❌ File not found: ${inputPDF}`);
  process.exit(1);
}

autoOrientPDF(inputPDF, outputPDF);
