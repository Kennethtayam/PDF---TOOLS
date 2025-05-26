const fs = require('fs');

const filePath = './dictionary.json'; // Update your file path

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Wrap the content in [ ] if missing
  const fixedData = `[${data.trim()}]`;

  try {
    const jsonData = JSON.parse(fixedData);

    // jsonData is an array of arrays
    jsonData.forEach(group => {
      group.forEach(([id, name]) => {
        // Remove 'CGC-' and pad the number
        const idNumber = id.replace('CGC-', '');
        const paddedNumber = idNumber.padStart(5, '0'); // Make sure 5 digits

        console.log(`${paddedNumber} - ${name}`);
      });
    });

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError.message);
  }
});



// for calling all data in Dictionary.js
// const fs = require('fs');

// const filePath = './dictionary.json'; // Your input file

// fs.readFile(filePath, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//     return;
//   }

//   const fixedData = `[${data.trim()}]`;

//   try {
//     const jsonData = JSON.parse(fixedData);

//     // Create an array
//     const formattedArray = [];

//     jsonData.forEach(group => {
//       group.forEach(([id, name]) => {
//         const idNumber = id.replace('CGC-', '');
//         const paddedNumber = idNumber.padStart(5, '0');
//         formattedArray.push(`${paddedNumber} - ${name}`);
//       });
//     });

//     console.log('✅ Employee CGC Number :');
//     console.log(formattedArray);

//   } catch (parseError) {
//     console.error('Error parsing JSON:', parseError.message);
//   }
// });








// const fs = require('fs');
// const path = require('path');

// // Path to the Test folder containing the Leave Cards
// const leaveCardsFolder = 'D:/Desktop/PDF SPLITTER TOOL/Test';  // Update path as necessary

// // Function to read all subfolders and their PDF files
// function parseLeaveCardsFolder() {
//   fs.readdir(leaveCardsFolder, { withFileTypes: true }, (err, entries) => {
//     if (err) {
//       console.error('Error reading Test folder:', err);
//       return;
//     }

//     // Array to store employee data
//     const leaveCardsData = [];

//     // Iterate over each directory in the Test folder
//     entries.forEach(entry => {
//       if (entry.isDirectory() && entry.name.startsWith('Leave Cards - ')) {
//         const employeeFolder = path.join(leaveCardsFolder, entry.name);

//         // Get all PDF files inside the employee's folder
//         fs.readdir(employeeFolder, (err, files) => {
//           if (err) {
//             console.error(`Error reading folder ${employeeFolder}:`, err);
//             return;
//           }

//           // Filter out only PDF files
//           const pdfFiles = files.filter(file => file.endsWith('.pdf'));

//           // Map the employee's name and their PDF files to an object
//           if (pdfFiles.length > 0) {
//             leaveCardsData.push({
//               employee: entry.name.replace('Leave Cards - ', ''), // Clean the employee name
//               pdfFiles: pdfFiles.map(file => path.parse(file).name) // Get file names without extensions
//             });
//           }

//           // Once done reading all files, output the result
//           if (leaveCardsData.length === entries.filter(entry => entry.isDirectory() && entry.name.startsWith('Leave Cards - ')).length) {
//             console.log('Parsed Leave Cards Data:', leaveCardsData);
//           }
//         });
//       }
//     });
//   });
// }

// // Call the function to parse the folder structure
// parseLeaveCardsFolder();







// for calling all data in Dictionary.js but in text not parse
// const fs = require('fs');

// const filePath = './dictionary.json'; // Your input file

// fs.readFile(filePath, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//     return;
//   }

//   const fixedData = `[${data.trim()}]`;

//   try {
//     const jsonData = JSON.parse(fixedData);

//     // Create an array
//     const formattedArray = [];

//     jsonData.forEach(group => {
//       group.forEach(([id, name]) => {
//         const idNumber = id.replace('CGC-', '');
//         const paddedNumber = idNumber.padStart(5, '0');
//         formattedArray.push(`${paddedNumber} - ${name}`);
//       });
//     });

//     console.log('Employee CGC Number:');
//     console.log(formattedArray);

//   } catch (parseError) {
//     console.error('Error parsing JSON:', parseError.message);
//   }
// });