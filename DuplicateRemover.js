const fs = require('fs');
const path = require('path');

// Directory containing PDF files
const directoryPath = 'C:\\Users\\Kenneth\\Desktop\\SCAN FILES\\program';

// Regular expression to match the desired file format
const completeNamePattern = /2024 PDS - [\w,\s.]+ - \d{4}\.\d{2}\.\d{2}\.pdf/;

// Function to remove duplicate PDF files
function removeDuplicates() {
    fs.readdir(directoryPath, (err, files) => {
        if (err) return console.error('Error reading directory:', err);

        const fileMap = new Map();

        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);
            if (path.extname(file) === '.pdf') {
                const baseName = file.replace(/\s*\(\d+\)\.pdf$/, '.pdf');

                if (!fileMap.has(baseName) || completeNamePattern.test(file)) {
                    fileMap.set(baseName, filePath);
                } else {
                    console.log('Deleting duplicate:', filePath);
                    fs.unlinkSync(filePath);
                }
            }
        });

        console.log('Duplicate removal complete.');
    });
}

removeDuplicates();
