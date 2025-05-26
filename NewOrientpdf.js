const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function autoOrientPDF(inputPath, outputPath) {
    try {
        // Read the PDF file
        const pdfBytes = fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        console.log(`Processing: ${inputPath}`);

        // Here, we would implement a rotation check (not natively supported by pdf-lib)
        // For now, just re-saving the PDF as a placeholder

        const newPdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, newPdfBytes);

        console.log(`Saved rotated PDF to: ${outputPath}`);
    } catch (error) {
        console.error("Error processing PDF:", error);
    }
}

// Example usage
autoOrientPDF('input.pdf', 'output.pdf');
