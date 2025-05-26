const fs = require('fs');
const path = require('path');

// Use forward slashes or double backslashes for file dir
const rootFolder = 'C://Users//Kenneth//Desktop//SCAN FILES//_LANDS//AR'; 

fs.readdir(rootFolder, { withFileTypes: true }, (err, entries) => {
  if (err) return console.error('Error reading directory:', err);

  // Filter subfolders only
  const folders = entries.filter(entry => entry.isDirectory());

  folders.forEach(folder => {
    const subfolderPath = path.join(rootFolder, folder.name);

    fs.readdir(subfolderPath, (err, files) => {
      if (err) return console.error(`Error reading subfolder ${folder.name}:`, err);

      // Filter only PDF files
      const matchingFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

      // Sort files
      matchingFiles.sort();

      // Rename each PDF
      matchingFiles.forEach((file, index) => {
        const newName = `AccomplishmentReport_${index + 1}.pdf`;
        const oldPath = path.join(subfolderPath, file);
        const newPath = path.join(subfolderPath, newName);

        fs.rename(oldPath, newPath, err => {
          if (err) console.error(`❌ Failed to rename ${file}:`, err);
          else console.log(`📄 Renamed: ${file} → ✅ Done: ${newName}`);
        });
      });
    });
  });
});
