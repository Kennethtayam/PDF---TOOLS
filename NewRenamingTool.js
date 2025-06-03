const fs = require('fs').promises;
const path = require('path');
const { createWorker } = require('tesseract.js');
const { PDFDocument } = require('pdf-lib');
const pdfjsLib = require('pdfjs-dist');

// Configuration
const CONFIG = {
  minConfidence: 70,       // Minimum OCR confidence percentage
  maxPages: 3,             // Max pages to process per PDF
  outputLength: 40,        // Max characters in filename
  dateFormat: 'YYYY-MM-DD',// Date format for filename
  logLevel: 'info'         // Tesseract log level
};

async function renameScannedPDFs(directory) {
  const worker = await createWorker('eng');
  await worker.setParameters({
    tessedit_pageseg_mode: '1', // Automatic page segmentation
    preserve_interword_spaces: '1'
  });

  try {
    const files = await fs.readdir(directory);
    
    for (const file of files) {
      if (path.extname(file).toLowerCase() === '.pdf') {
        const filePath = path.join(directory, file);
        console.log(`Processing: ${file}`);
        
        try {
          const newName = await generateFilename(filePath, worker);
          const newPath = path.join(directory, newName + '.pdf');
          
          await fs.rename(filePath, newPath);
          console.log(`Renamed to: ${newName}.pdf`);
        } catch (error) {
          console.error(`Error processing ${file}:`, error.message);
        }
      }
    }
  } finally {
    await worker.terminate();
  }
}

async function generateFilename(pdfPath, worker) {
  // Try text extraction first
  const pdfText = await extractPDFText(pdfPath);
  
  if (pdfText.trim().length > 20) {
    return cleanFilename(pdfText);
  }
  
  // Fallback to OCR if text extraction fails
  console.log('Text extraction failed, using OCR...');
  const ocrText = await processWithOCR(pdfPath, worker);
  return cleanFilename(ocrText);
}

async function extractPDFText(pdfPath) {
  const data = new Uint8Array(await fs.readFile(pdfPath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  let fullText = '';

  for (let i = 1; i <= Math.min(doc.numPages, CONFIG.maxPages); i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(' ') + '\n';
  }

  return fullText;
}

async function processWithOCR(pdfPath, worker) {
  const pdfDoc = await PDFDocument.load(await fs.readFile(pdfPath));
  const images = await extractImagesFromPDF(pdfDoc);
  let ocrText = '';

  for (const image of images.slice(0, CONFIG.maxPages)) {
    const { data: { text } } = await worker.recognize(image);
    ocrText += text + '\n';
  }

  return ocrText;
}

async function extractImagesFromPDF(pdfDoc) {
  const images = [];
  
  for (let i = 0; i < Math.min(pdfDoc.getPageCount(), CONFIG.maxPages); i++) {
    const page = pdfDoc.getPage(i);
    const xObjects = await page.node.commonResources.get('XObject');
    
    if (xObjects) {
      for (const [name, ref] of xObjects.entries()) {
        const xObject = ref instanceof PDFRef 
          ? await pdfDoc.context.lookup(ref) 
          : ref;
        
        if (xObject instanceof PDFImage) {
          const image = await pdfDoc.embedPng(await xObject.decode());
          images.push(await image.png());
        }
      }
    }
  }
  
  return images;
}

function cleanFilename(text) {
  // Extract first meaningful content
  const lines = text.split('\n').filter(line => line.trim().length > 5);
  const content = lines.length > 0 ? lines[0] : text.substring(0, 100);
  
  // Clean and format filename
  return content
    .replace(/[^\w\s]/gi, '')          // Remove special characters
    .replace(/\s+/g, ' ')               // Collapse whitespace
    .trim()                             // Trim edges
    .substring(0, CONFIG.outputLength)  // Limit length
    .replace(/\s+/g, '_');              // Replace spaces with underscores
}

// Usage: node rename-pdfs.js /path/to/pdf/folder
const [directory] = process.argv.slice(2);
if (!directory) {
  console.error('Please provide a directory path');
  process.exit(1);
}

renameScannedPDFs(directory).catch(console.error);