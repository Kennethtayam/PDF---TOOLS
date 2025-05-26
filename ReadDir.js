const fs = require('fs');
const path = require('path');

const testFolder = './NEW PROJECT'; // Your main Test folder
const dictionaryPath = path.join(testFolder, 'dictionary.json');

// 1. Read the dictionary.json
fs.readFile(dictionaryPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading dictionary.json:', err);
    return;
  }

  let dictionary = [];
  try {
    const fixedData = `[${data.trim()}]`; // Fix if needed
    dictionary = JSON.parse(fixedData);
  } catch (parseError) {
    console.error('Error parsing dictionary.json:', parseError);
    return;
  }

  // 2. Read all folders inside Test
  fs.readdir(testFolder, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error('Error reading Test folder:', err);
      return;
    }

    // 3. Process each person in the dictionary
    dictionary.forEach(([id, name]) => {
      const cleanId = id.replace('CGC-', '').padStart(5, '0');
      const leaveCardFolderName = `Leave Cards - ${name}`;
      const leaveCardFolderPath = path.join(testFolder, leaveCardFolderName);

      if (entries.some(entry => entry.isDirectory() && entry.name === leaveCardFolderName)) {
        // 4. If folder exists, list PDFs
        fs.readdir(leaveCardFolderPath, (err, files) => {
          if (err) {
            console.error(`Error reading folder ${leaveCardFolderName}:`, err);
            return;
          }

          const pdfFiles = files
            .filter(file => file.endsWith('.pdf'))
            .map(file => path.parse(file).name); // Remove .pdf extension

          // 5. Print output
          console.log(`${cleanId} - ${name.toUpperCase()}`);
          pdfFiles.forEach(pdf => {
            console.log(`[${pdf}]`);
          });
          console.log(''); // Empty line after each person
        });
      }
    });
  });
});
