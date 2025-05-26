const oldArray = require('./dictionary.js'); // Now this will be an array

const fs = require('fs');

const newObject = {};

for (const [cgcWithPrefix, name] of oldArray) {
  const cgcNumber = cgcWithPrefix.replace('CGC-', '');
  newObject[name] = cgcNumber;
}

fs.writeFileSync('dictionary.json', JSON.stringify(newObject, null, 2));

console.log('✅ Successfully converted dictionary.js to dictionary.json!');
