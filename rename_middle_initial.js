const fs = require("fs");
const path = require("path");

// Folder where the PDFs are located
const folderPath = "F:\\02 - 201 to Rename\\SCANNED PDF REGULAR EMPLOYEES\\Canillas Ernesto Gregorio"; // current folder

// Read all files in the folder
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === ".pdf") {
            const nameWithoutExt = path.basename(file, ".pdf");

            // Match pattern: Last First Middle_Page_Number
            const match = nameWithoutExt.match(/(.+?) (.+?) (.+?)_(Page_\d+)/);

            if (match) {
                const [ , last, first, middle, page ] = match;

                // Make middle initial
                const middleInitial = middle.charAt(0) + ".";

                const newName = `${last} ${first} ${middleInitial}_${page}.pdf`;

                fs.rename(
                    path.join(folderPath, file),
                    path.join(folderPath, newName),
                    err => {
                        if (err) console.error("Rename error:", err);
                        else console.log(`Renamed: ${file} → ${newName}`);
                    }
                );
            }
        }
    });
});
