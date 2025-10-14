const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');

// ✅ Set your network folder path here (double backslashes)
const networkSharedFolder = '//192.168.50.214//d//DAR'; // Example — update this

// Function to split one PDF
async function splitPDF(inputPath, outputFolder) {
    try {
        const pdfBytes = fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const fileName = path.basename(inputPath, path.extname(inputPath));
        const totalPages = pdfDoc.getPageCount();

        console.log(`📄 Splitting: ${fileName} (${totalPages} pages)`);

        for (let i = 0; i < totalPages; i++) {
            const newPdf = await PDFDocument.create();
            const [page] = await newPdf.copyPages(pdfDoc, [i]);
            newPdf.addPage(page);

            const outputFileName = `${fileName}_Page_${i + 1}.pdf`;
            const outputPath = path.join(outputFolder, outputFileName);

            const newPdfBytes = await newPdf.save();
            fs.writeFileSync(outputPath, newPdfBytes);

            console.log(`✅ Saved to network: ${outputFileName}`);
        }

        console.log(`🎉 Finished splitting: ${fileName}`);
    } catch (error) {
        console.error(`❌ Error splitting ${inputPath}: ${error.message}`);
    }
}

// Process all PDFs in your local folder
async function processAllPDFs(localFolderPath) {
    if (!fs.existsSync(networkSharedFolder)) {
        console.error('❌ Network path does not exist or is not accessible!');
        return;
    }

    const files = fs.readdirSync(localFolderPath);
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

    if (pdfFiles.length === 0) {
        console.log('⚠️  No PDF files found in the folder.');
        return;
    }

    for (const file of pdfFiles) {
        const inputPath = path.join(localFolderPath, file);
        await splitPDF(inputPath, networkSharedFolder);
    }

    console.log('✔️  All PDFs split and saved to the network folder!');
}

// 📂 Set your local folder path here (where the PDFs are)
const localFolderPath = path.join(
    'D:',
    'DAR'

    // D://Kuya fred Scan 201//SCANNED PDF REGULAR EMPLOYEES//Adviento, Jerome Anas
);

// 🚀 Run the process
processAllPDFs(localFolderPath).catch(console.error);























































// const fs = require('fs');
// const { PDFDocument } = require('pdf-lib');
// const path = require('path');

// async function splitPDF(inputPath, outputRoot) {
//     const pdfBytes = fs.readFileSync(inputPath);
//     const pdfDoc = await PDFDocument.load(pdfBytes);

//     const fileName = path.basename(inputPath, path.extname(inputPath));
//     const outputFolder = path.join(outputRoot, fileName);

//     if (!fs.existsSync(outputFolder)) {
//         fs.mkdirSync(outputFolder, { recursive: true });
//     }

//     for (let i = 0; i < pdfDoc.getPageCount(); i++) {
//         const newPdf = await PDFDocument.create();
//         const [page] = await newPdf.copyPages(pdfDoc, [i]);
//         newPdf.addPage(page);

//         const newPdfBytes = await newPdf.save(); // Save as buffer
//         const outputPath = path.join(outputFolder, `${fileName}_Page_${i + 1}.pdf`);

//         fs.writeFileSync(outputPath, newPdfBytes); // Save properly
//         console.log(`✅ Saved: ${outputPath}`);
//     }
// }

// async function processAllPDFs(folderPath) {
//     const files = fs.readdirSync(folderPath);
//     const pdfFiles = files.filter(f => path.extname(f).toLowerCase() === '.pdf');

//     for (const file of pdfFiles) {
//         const fullPath = path.join(folderPath, file);
//         await splitPDF(fullPath, folderPath);
//     }
// }

// const folderPath = path.join(
//     'C:',
//     'Users',
//     'Kenneth.CHRMO-140',
//     'Desktop',
//     'Desktop',
//     '201 FILES',
//     'new'
// );
// // C:\Users\Kenneth.CHRMO-140\Desktop\Desktop\201 FILES\RECHECKING

// processAllPDFs(folderPath).catch(console.error);


















//     // 'D:',
//     // 'Testing',
//     // 'RECHECKING',
//     // 'Desktop',
//     // 'SCAN FILES',
//     // 'EMPLOYEE LEAVE CARD - (ACTIVE)',
//     // 'City Health Services Department',
//     // 'Leave Cards - Silva, Merian T'
//         'C:',
//     'Users',
//     'Kenneth.CHRMO-140',
//     'Desktop',
//     'Desktop',
//     '201 FILES',
//     'INACTIVE EMPLOYEES - OLD RECORDS',
//     'RECHECKING'