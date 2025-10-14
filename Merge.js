const PDFMerger = require('pdf-merger-js');
const fs = require('fs');
const path = require('path');

// ✅ Get dry-run flag from CLI args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// ✅ EDIT THIS SECTION BELOW
const filesToMerge = [
  "//192.168.50.214//d//NEWLY HIRED 4-23-19//Cauntay, Xioven Christopher E//Cauntay, Xioven Christopher E._Appointment_1.pdf",
  "//192.168.50.214//d//NEWLY HIRED 4-23-19//Cauntay, Xioven Christopher E//Cauntay, Xioven Christopher E._Appointment_2.pdf",
  // Add more files here...
];

const outputFile = "//192.168.50.214//d//NEWLY HIRED 4-23-19//Cauntay, Xioven Christopher E//Cauntay, Xioven Christopher E._Appointment.pdf";
// ✅ END OF EDIT SECTION

function isPDF(filePath) {
  return fs.existsSync(filePath) && path.extname(filePath).toLowerCase() === '.pdf';
}

async function mergePDFs(inputFiles, outputPath) {
  const merger = new PDFMerger();
  const validFiles = [];

  for (const file of inputFiles) {
    const fullPath = path.resolve(file);
    if (isPDF(fullPath)) {
      console.log(`📄 Found: ${fullPath}`);
      if (!dryRun) await merger.add(fullPath);
      validFiles.push(fullPath);
    } else {
      console.warn(`⚠️ Skipped (not found or not a PDF): ${fullPath}`);
    }
  }

  if (validFiles.length < 2) {
    console.error('❌ Need at least two valid PDF files to merge.');
    return;
  }

  const outputPathResolved = path.resolve(outputPath);

  if (dryRun) {
    console.log(`\n🧪 Dry Run Enabled — No actual merging or deleting will happen`);
    console.log(`✅ Would merge into: ${outputPathResolved}`);
    validFiles.forEach(file => console.log(`🗑️ Would delete: ${file}`));
  } else {
    await merger.save(outputPathResolved);
    console.log(`✅ Merged ${validFiles.length} PDF(s) into: ${outputPathResolved}`);

    for (const file of validFiles) {
      try {
        fs.unlinkSync(file);
        console.log(`🗑️ Deleted: ${file}`);
      } catch (err) {
        console.error(`❌ Failed to delete: ${file} — ${err.message}`);
      }
    }
  }
}

// 🏁 Run it
mergePDFs(filesToMerge, outputFile);
