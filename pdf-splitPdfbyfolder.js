const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');



// Function to split a single PDF
async function splitPDF(inputPath, logArray) {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Only split if the PDF has 2 or more pages
    if (pdfDoc.getPageCount() < 2) {
        console.log(`📄 Skipping: ${inputPath} (Only 1 page)`);
        return;
    }

    console.log(`✂️ Splitting: ${inputPath} (${pdfDoc.getPageCount()} pages)`);

    const fileName = path.basename(inputPath, path.extname(inputPath));
    const outputFolder = path.dirname(inputPath); // Get the original folder path

    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(page);

        const outputPath = path.join(outputFolder, `${fileName}_Page_${i + 1}.pdf`);
        const newPdfBytes = await newPdf.save();
        fs.writeFileSync(outputPath, newPdfBytes);

        console.log(`✅ Saved: ${outputPath}`);
        logArray.push(outputPath);
    }

    console.log(`🎉 Finished splitting: ${fileName}`);
}

// Function to scan folders recursively
function getAllPDFs(dir) {
    let pdfFiles = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // If it's a folder, scan it recursively
            pdfFiles = pdfFiles.concat(getAllPDFs(fullPath));
        } else if (path.extname(file).toLowerCase() === '.pdf') {
            // If it's a PDF file, add it to the list
            pdfFiles.push(fullPath);
        }
    }

    return pdfFiles;
}

// Main function to process all PDFs in all subfolders
async function processAllPDFs(folderPath) {
    console.log(`🔍 Scanning folders: ${folderPath}`);

    const pdfFiles = getAllPDFs(folderPath);
    const splitLog = [];

    if (pdfFiles.length === 0) {
        console.log('⚠️ No PDF files found!');
        return;
    }

    console.log(`📁 Found ${pdfFiles.length} PDF file(s)`);

    for (const file of pdfFiles) {
        console.log(`🔍 Processing: ${file}`);
        await splitPDF(file, splitLog);
    }

    console.log('✨ All PDFs split successfully!');

    // Create a log file of all successfully split PDFs
      
    const logPath = path.join(folderPath, 'split_log.txt');
    fs.writeFileSync(logPath, splitLog.join('\n'));
    console.log(`📋 Split log saved: ${logPath}`);

    console.log('\n📌 ** Split PDF Summary **');
    splitLog.forEach(file => console.log(`✅ ${file}`));

     // console.log(`📋 Split log saved: ${logPath}`);
}

// Set the root folder to scan
const folderPath = path.join("C:\\Users\\Kenneth\\Desktop\\Testing Folder", someOtherPath);

    


// Start the process
processAllPDFs(folderPath).catch(console.error);






// const folderPath = "C:\\Users\\Kenneth\\Desktop\\Testing Folder\\Leave Cards - Copy";
