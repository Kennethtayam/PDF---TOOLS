const fs = require('fs');
const path = require('path');

const mainDirectory = '.'; // Use current directory

fs.readdir(mainDirectory, { withFileTypes: true }, (err, items) => {
  if (err) return console.error('Error reading main directory:', err);

  items.forEach(item => {
    if (item.isDirectory()) {
      const folderPath = path.join(mainDirectory, item.name);
      console.log(`+ ${item.name}`);

      fs.readdir(folderPath, (err, files) => {
        if (err) return console.error(`Error reading ${item.name}:`, err);

        files.forEach(file => {
          console.log(`  - ${file}`);
        });
      });
    }
  });
});
