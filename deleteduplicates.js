const fs = require('fs');
const path = require('path');

// Specify the directory to scan
const directoryPath = 'C:\\Users\\Kenneth\\Desktop\\2017 - OK'; // Change this to your target folder

// Define the patterns to match (2) to (6)
const patterns = ['(2)'];

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.error(`Unable to scan directory: ${err}`);
    }

    files.forEach((file) => {
        // Check if the filename contains any of the patterns
        if (patterns.some(pattern => file.includes(pattern))) {
            const filePath = path.join(directoryPath, file);

            // Delete the file
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete ${file}: ${err}`);
                } else {
                    console.log(`Deleted: ${file}`);
                }
            });
        }
    });
});
