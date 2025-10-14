const fs = require('fs');
const path = require('path');

// 🔠 Convert text to Proper Case
function toProperCase(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

const folderPath = 'D://Kuya fred Scan 201//SCANNED PDF REGULAR EMPLOYEES//Adviento, Jerome Anas'; // Change to your folder path

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('❌ Error reading folder:', err);
    return;
  }

  let renamed = 0;
  let skipped = 0;

  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.pdf') {
      const oldPath = path.join(folderPath, file);
      const baseName = path.basename(file, ext);
      const properName = toProperCase(baseName);
      const newFileName = `${properName}${ext}`;
      const newPath = path.join(folderPath, newFileName);

      // Windows won't rename if only letter case is changed — workaround:
      if (oldPath.toLowerCase() === newPath.toLowerCase() && oldPath !== newPath) {
        const tempPath = path.join(folderPath, `__temp__${Date.now()}${ext}`);
        fs.renameSync(oldPath, tempPath); // rename to temp name
        fs.renameSync(tempPath, newPath); // rename to final name
        console.log(`✅ Renamed (Windows workaround): ${file} → ${newFileName}`);
        renamed++;
      }
      else if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Renamed: ${file} → ${newFileName}`);
        renamed++;
      } else {
        console.log(`⏭️ Skipped (already correct): ${file}`);
        skipped++;
      }
    }
  });

  console.log(`\n✔️ Done! Renamed: ${renamed}, Skipped: ${skipped}`);
});










