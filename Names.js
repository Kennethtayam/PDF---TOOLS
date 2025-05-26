// const fs = require('fs');
// const path = require('path');

// function listFolders(directoryPath) {
//   try {
//     // Read the file as plain text, not JSON
//     const data = fs.readFileSync(directoryPath, 'utf-8');
//     console.log("Raw file content:", data); // Debugging: see what the file actually contains

//     // Split lines if the content is a list of folder names
//     const folders = data.split('\n').map(line => line.trim()).filter(line => line !== '');

//     folders.forEach(folderName => {
//       console.log(`Folder: "${folderName}"`);
//     });
//   } catch (error) {
//     console.error('Error reading file:', error.message);
//   }
// }

// // Example usage:
// const directoryPath = 'C:\\Users\\Kenneth\\Desktop\\SCAN FILES\\EMPLOYEE LEAVE CARD - (ACTIVE)\\Complete Leave Cards\\folderNames.txt';
// listFolders(directoryPath);


























const fs = require('fs');
const path = require('path');

function getCleanedName(folderName) {
  // Remove the "Leave Cards -" prefix and any extra spaces
  return folderName.replace(/^Leave Cards\s*-\s*/i, '').trim();
}

function listFolders(directoryPath) {
  try {
    const folders = fs.readdirSync(directoryPath);
    folders.forEach(folderName => {
      const cleanedName = getCleanedName(folderName);
      console.log(` Cleaned: "${cleanedName}"`);
    });
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
}

// Example usage:
const directoryPath = 'C:\\Users\\Kenneth\\Desktop\\SCAN FILES\\EMPLOYEE LEAVE CARD - (ACTIVE)\\Complete Leave Cards';
listFolders(directoryPath);
