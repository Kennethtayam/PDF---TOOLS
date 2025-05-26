const fs = require('fs');
const path = require('path');

// Make sure your basePath is correct
const basePath = 'C:\\Users\\Kenneth\\Desktop\\SCAN FILES\\EMPLOYEE LEAVE CARD - (ACTIVE)\\Complete Leave Cards'; 

const result = []; // Final parsed array

// Load dictionary.json
const dictionary = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

// Extract date range from file name like "2020.12-2022.01"
function extractDateRange(fileName) {
  const match = fileName.match(/\d{4}\.\d{2}-\d{4}\.\d{2}/);
  return match ? match[0] : fileName; 
}

// Clean folder name (remove "Leave Cards - " and add middle initial dot)
function cleanFolderName(folderName) {
  let cleanedName = folderName.replace(/^Leave Cards\s*-\s*/i, '').trim(0);
  cleanedName = cleanedName.replace(/(\b[A-Z])\b/g, '$1.'); // Add dot for middle initial
  return cleanedName;
}

// Find CGC number by folder name
function findCGCNumber(fullName) {
  const upperName = fullName.toUpperCase();
  for (const [name, cgc] of Object.entries(dictionary)) {
    if (name.toUpperCase() === upperName) {
      return cgc;
    }
  }
  return 'NO_CGC'; // fallback if not found
}

// Build folder structure
function buildStructure(folderPath) {
  const folders = fs.readdirSync(folderPath).filter(item => {
    return fs.statSync(path.join(folderPath, item)).isDirectory();
  }).sort();

  for (const folder of folders) {
    const fullFolderPath = path.join(folderPath, folder);

    const files = fs.readdirSync(fullFolderPath)
      .filter(item => fs.statSync(path.join(fullFolderPath, item)).isFile())
      .sort()
      .map(file => extractDateRange(file));

    result.push({
      folder: cleanFolderName(folder),
      files: files
    });
  }
}

// Run the function
buildStructure(basePath);

// Output
for (const entry of result) {
  const cgcNumber = findCGCNumber(entry.folder);
  console.log(`${cgcNumber} - ${entry.folder.toUpperCase()}`);
  for (const file of entry.files) {
    console.log(`  ['${file}']`);
  }
}
